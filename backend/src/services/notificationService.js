const mongoose = require("mongoose");
const Notification = require("../models/notification");
const AppError = require("../utils/appError");
const { startOfToday, parseLocalDate, MS_PER_DAY } = require("../utils/dateUtils");

const getExpiryDate = (item) => {
  return parseLocalDate(item.expiryDate);
};

const getEventDefinitions = (item, today = startOfToday()) => {
  const events = [
    {
      eventKey: `${item._id}-added`,
      type: "added",
      title: "New item added",
      message: `${item.name} was added to your inventory.`,
      occurredAt: item.createdAt || new Date(),
    },
  ];

  if (item.status === "consumed" || item.consumedAt) {
    const consumedTime = item.consumedAt ? new Date(item.consumedAt).getTime() : Date.now();
    events.push({
      eventKey: `${item._id}-consumed-${consumedTime}`,
      type: "consumed",
      title: `${item.name} was consumed`,
      message: `${item.quantity || 1} ${item.quantity === 1 ? "unit" : "units"} marked as consumed.`,
      occurredAt: item.consumedAt || new Date(),
    });
    return events;
  }

  const expiryDate = getExpiryDate(item);
  if (!expiryDate) return events;

  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / MS_PER_DAY);

  if (item.status === "expired" || daysUntilExpiry < 0) {
    events.push({
      eventKey: `${item._id}-expired-${item.expiryDate}`,
      type: "expired",
      title: `${item.name} has expired`,
      message: `This item expired on ${item.expiryDate}.`,
      occurredAt: expiryDate,
    });
  } else if (daysUntilExpiry <= 3) {
    events.push({
      eventKey: `${item._id}-expiring-${item.expiryDate}`,
      type: "expiring",
      title: `${item.name} is expiring soon`,
      message:
        daysUntilExpiry === 0
          ? "This item expires today."
          : `This item will expire in ${daysUntilExpiry} ${daysUntilExpiry === 1 ? "day" : "days"}.`,
      occurredAt: expiryDate,
    });
  }

  return events;
};

const recordEvent = async (userId, itemId, event) => {
  if (!userId || !itemId || !event || !event.eventKey) return null;

  return Notification.findOneAndUpdate(
    { userId, eventKey: event.eventKey },
    {
      $set: {
        itemId,
        type: event.type,
        title: event.title,
        message: event.message,
        occurredAt: event.occurredAt || new Date(),
      },
      $setOnInsert: { read: false, deletedAt: null },
    },
    { upsert: true, new: true },
  );
};

const syncNotifications = async (userId, items = []) => {
  const today = startOfToday();
  const operations = items.flatMap((item) =>
    getEventDefinitions(item, today).map((event) => ({
      updateOne: {
        filter: { userId, eventKey: event.eventKey },
        update: {
          $set: {
            itemId: item._id,
            type: event.type,
            title: event.title,
            message: event.message,
            occurredAt: event.occurredAt,
          },
          $setOnInsert: { read: false, deletedAt: null },
        },
        upsert: true,
      },
    })),
  );

  if (operations.length > 0) {
    await Notification.bulkWrite(operations);
  }
};

const listNotifications = async (userId, limit = 50) => {
  const Item = mongoose.models.Item || require("../models/item");
  const items = await Item.find({ userId }).lean();
  await syncNotifications(userId, items);

  const notifications = await Notification.find({ userId, deletedAt: null })
    .sort({ occurredAt: -1 })
    .limit(limit)
    .lean();

  return notifications;
};

const markNotificationRead = async (userId, notificationId) => {
  if (!mongoose.isValidObjectId(notificationId)) {
    throw new AppError("Invalid notification ID", 400);
  }

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true },
  ).lean();

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  return notification;
};

const markAllNotificationsRead = async (userId) => {
  await Notification.updateMany(
    { userId, read: false },
    { read: true },
  );
  return true;
};

const deleteNotification = async (userId, notificationId) => {
  if (!mongoose.isValidObjectId(notificationId)) {
    throw new AppError("Invalid notification ID", 400);
  }

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { deletedAt: new Date() },
    { new: true },
  ).lean();

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  return true;
};

module.exports = {
  recordEvent,
  syncNotifications,
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getEventDefinitions,
};
