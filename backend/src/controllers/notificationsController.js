const Item = require("../models/item");
const Notification = require("../models/notification");

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const getExpiryDate = (item) => {
  const expiryDate = new Date(`${item.expiryDate}T00:00:00`);
  return Number.isNaN(expiryDate.getTime()) ? null : expiryDate;
};

const getEventDefinitions = (item) => {
  const events = [
    {
      eventKey: `${item._id}-added`,
      type: "added",
      title: "New item added",
      message: `${item.name} was added to your inventory.`,
      occurredAt: item.createdAt,
    },
  ];

  if (item.consumedAt) {
    events.push({
      eventKey: `${item._id}-consumed-${new Date(item.consumedAt).getTime()}`,
      type: "consumed",
      title: `${item.name} was consumed`,
      message: `${item.quantity} ${item.quantity === 1 ? "unit" : "units"} marked as consumed.`,
      occurredAt: item.consumedAt,
    });
    return events;
  }

  const expiryDate = getExpiryDate(item);
  if (!expiryDate) return events;

  const daysUntilExpiry = Math.ceil(
    (expiryDate - startOfToday()) / MS_PER_DAY,
  );

  if (daysUntilExpiry < 0) {
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

const syncNotifications = async (userId, items) => {
  const operations = items.flatMap((item) =>
    getEventDefinitions(item).map((event) => ({
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
          $setOnInsert: { read: false },
        },
        upsert: true,
      },
    })),
  );

  if (operations.length > 0) {
    await Notification.bulkWrite(operations);
  }
};

const listNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const items = await Item.find({ userId }).lean();
    await syncNotifications(userId, items);

    const notifications = await Notification.find({ userId, deletedAt: null })
      .sort({ occurredAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json({
      success: true,
      data: { notifications },
    });
  } catch (error) {
    console.error("List Notifications Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load notifications",
    });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { read: true },
      { new: true },
    ).lean();

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({ success: true, data: { notification } });
  } catch (error) {
    console.error("Mark Notification Read Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.userId, read: false },
      { read: true },
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mark All Notifications Read Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update notifications",
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const result = await Notification.updateOne(
      {
        _id: req.params.id,
        userId: req.user.userId,
        deletedAt: null,
      },
      { $set: { deletedAt: new Date() } },
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete Notification Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
};

module.exports = {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
};
