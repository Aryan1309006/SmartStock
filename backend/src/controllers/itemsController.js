const Item = require("../models/item");
const User = require("../models/user");
const mongoose = require("mongoose");

const createItem = async (req, res) => {
  try {
    const {
      name,
      category,
      purchaseDate,
      price,
      notes,
      quantity,
      status,
      expiryDate,
    } = req.body;
    if (
      !name ||
      !category ||
      !purchaseDate ||
      price == null ||
      price <= 0 ||
      price == undefined ||
      !status ||
      !expiryDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Incomplete credential",
      });
    }
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    const itemQuantity = !quantity || quantity <= 0 ? 1 : quantity;

    const item = await Item.create({
      userId: req.user.userId,
      name: name.trim(),
      category: category.trim(),
      purchaseDate,
      price,
      notes: notes ? notes.trim() : "",
      quantity: itemQuantity,
      status,
      expiryDate,
    });

    return res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: {
        item: {
          ...item.toObject(),
        },
      },
    });
  } catch (error) {
      console.error("Create Item Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const showAll = async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      data: {
        items,
      },
    });
  } catch (error) {
    console.error("Show All Items Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const showOne = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID",
      });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {
        item,
      },
    });
  } catch (error) {
    console.error("Show One Item Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const updateOne = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
    });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {
        item,
      },
    });
  } catch (error) {
    console.error("Update Item Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const deleteOne = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Delete Item Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const markConsume = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status: "consumed" },
      { returnDocument: 'after' },
    );
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {
        item,
      },
    });
  } catch (error) {
    console.error("Mark Consume Item Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const restore = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status: "available" },
      { returnDocument: 'after' },
    );
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {
        item,
      },
    });
  } catch (error) {
    console.error("Restore Item Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createItem,
  showAll,
  showOne,
  updateOne,
  deleteOne,
  markConsume,
  restore,
};
