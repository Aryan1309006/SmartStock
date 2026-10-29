const mongoose = require("mongoose");
const Item = require("../models/item");
const AppError = require("../utils/appError");
const notificationService = require("./notificationService");

const VALID_CATEGORIES = ["Pantry", "Dairy", "Medicine", "Toiletries", "Cleaning", "Other"];
const VALID_STATUSES = ["active", "consumed", "expired"];

const validateObjectId = (id, fieldName = "ID") => {
  if (!id || !mongoose.isValidObjectId(id)) {
    throw new AppError(`Invalid ${fieldName}`, 400);
  }
};

const createItem = async (userId, data = {}) => {
  validateObjectId(userId, "User ID");

  const {
    name,
    category,
    purchaseDate,
    expiryDate,
    price,
    notes,
    quantity,
    status,
  } = data;

  if (
    !name ||
    !category ||
    !purchaseDate ||
    !expiryDate ||
    price === null ||
    price === undefined ||
    Number(price) < 0
  ) {
    throw new AppError("Incomplete credential", 400);
  }

  const trimmedCategory = String(category).trim();
  if (!VALID_CATEGORIES.includes(trimmedCategory)) {
    throw new AppError(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`, 400);
  }

  const itemQuantity = !quantity || Number(quantity) <= 0 ? 1 : Math.floor(Number(quantity));
  const itemStatus = status && VALID_STATUSES.includes(status) ? status : "active";

  const item = await Item.create({
    userId,
    name: String(name).trim(),
    category: trimmedCategory,
    purchaseDate: String(purchaseDate).trim(),
    expiryDate: String(expiryDate).trim(),
    price: Number(price),
    notes: notes ? String(notes).trim() : "",
    quantity: itemQuantity,
    status: itemStatus,
    consumedAt: itemStatus === "consumed" ? new Date() : null,
  });

  // Record notification for added item
  try {
    await notificationService.recordEvent(userId, item._id, {
      eventKey: `${item._id}-added`,
      type: "added",
      title: "New item added",
      message: `${item.name} was added to your inventory.`,
      occurredAt: item.createdAt || new Date(),
    });
  } catch (err) {
    console.error("Failed to record added item notification:", err.message);
  }

  return item.toObject();
};

const getItems = async (userId, options = {}) => {
  validateObjectId(userId, "User ID");

  const query = { userId };

  if (options.status) {
    query.status = options.status;
  }
  if (options.category) {
    query.category = options.category;
  }
  if (options.search) {
    query.name = { $regex: options.search.trim(), $options: "i" };
  }

  const sortOptions = options.sort || { createdAt: -1 };

  const items = await Item.find(query).sort(sortOptions).lean();
  return items;
};

const getItemById = async (userId, itemId) => {
  validateObjectId(userId, "User ID");
  validateObjectId(itemId, "item ID");

  const item = await Item.findOne({ _id: itemId, userId }).lean();
  if (!item) {
    throw new AppError("Item not found", 404);
  }
  return item;
};

const updateItem = async (userId, itemId, updates = {}) => {
  validateObjectId(userId, "User ID");
  validateObjectId(itemId, "item ID");

  const allowedFields = [
    "name",
    "category",
    "purchaseDate",
    "expiryDate",
    "price",
    "notes",
    "quantity",
    "status",
  ];

  const sanitized = {};
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      if (field === "price") {
        const val = Number(updates[field]);
        if (isNaN(val) || val < 0) {
          throw new AppError("Price must be a non-negative number", 400);
        }
        sanitized[field] = val;
      } else if (field === "quantity") {
        const val = Number(updates[field]);
        if (isNaN(val) || val < 1) {
          throw new AppError("Quantity must be at least 1", 400);
        }
        sanitized[field] = Math.floor(val);
      } else if (field === "category") {
        if (!VALID_CATEGORIES.includes(updates[field])) {
          throw new AppError("Invalid category", 400);
        }
        sanitized[field] = updates[field];
      } else if (field === "status") {
        if (!VALID_STATUSES.includes(updates[field])) {
          throw new AppError("Invalid status", 400);
        }
        sanitized[field] = updates[field];
        if (updates[field] === "consumed") {
          sanitized.consumedAt = new Date();
        } else if (updates[field] === "active") {
          sanitized.consumedAt = null;
        }
      } else {
        sanitized[field] = updates[field];
      }
    }
  }

  const item = await Item.findOneAndUpdate(
    { _id: itemId, userId },
    { $set: sanitized },
    { new: true, runValidators: true },
  ).lean();

  if (!item) {
    throw new AppError("Item not found", 404);
  }

  return item;
};

const deleteItem = async (userId, itemId) => {
  validateObjectId(userId, "User ID");
  validateObjectId(itemId, "item ID");

  const item = await Item.findOneAndDelete({ _id: itemId, userId });
  if (!item) {
    throw new AppError("Item not found", 404);
  }

  return true;
};

const consumeItem = async (userId, itemId, amount) => {
  validateObjectId(userId, "User ID");
  validateObjectId(itemId, "item ID");

  const item = await Item.findOne({ _id: itemId, userId });
  if (!item) {
    throw new AppError("Item not found", 404);
  }

  // Handle partial consumption
  if (amount !== undefined && amount !== null && amount !== "") {
    const consumeAmount = Number(amount);
    if (isNaN(consumeAmount) || consumeAmount <= 0) {
      throw new AppError("Consumption amount must be a positive number", 400);
    }

    if (consumeAmount < item.quantity) {
      item.quantity -= consumeAmount;
      await item.save();

      // Record partial consumption notification
      try {
        await notificationService.recordEvent(userId, item._id, {
          eventKey: `${item._id}-consumed-${Date.now()}`,
          type: "consumed",
          title: `${item.name} was partially consumed`,
          message: `${consumeAmount} unit(s) consumed. ${item.quantity} remaining.`,
          occurredAt: new Date(),
        });
      } catch (err) {
        console.error("Failed to record consumed notification:", err.message);
      }

      return item.toObject();
    }
  }

  // Fully consumed
  item.status = "consumed";
  item.consumedAt = new Date();
  await item.save();

  try {
    await notificationService.recordEvent(userId, item._id, {
      eventKey: `${item._id}-consumed-${item.consumedAt.getTime()}`,
      type: "consumed",
      title: `${item.name} was consumed`,
      message: `${item.quantity} ${item.quantity === 1 ? "unit" : "units"} marked as consumed.`,
      occurredAt: item.consumedAt,
    });
  } catch (err) {
    console.error("Failed to record consumed notification:", err.message);
  }

  return item.toObject();
};

const restoreItem = async (userId, itemId) => {
  validateObjectId(userId, "User ID");
  validateObjectId(itemId, "item ID");

  const item = await Item.findOneAndUpdate(
    { _id: itemId, userId },
    { status: "active", consumedAt: null },
    { new: true, runValidators: true },
  ).lean();

  if (!item) {
    throw new AppError("Item not found", 404);
  }

  return item;
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  consumeItem,
  restoreItem,
  validateObjectId,
};
