const notificationService = require("../services/notificationService");
const asyncHandler = require("../middleware/asyncHandler");

const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.listNotifications(req.user.userId);
  return res.status(200).json({
    success: true,
    data: { notifications },
  });
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markNotificationRead(req.user.userId, req.params.id);
  return res.status(200).json({
    success: true,
    data: { notification },
  });
});

const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllNotificationsRead(req.user.userId);
  return res.status(200).json({
    success: true,
  });
});

const deleteNotification = asyncHandler(async (req, res) => {
  await notificationService.deleteNotification(req.user.userId, req.params.id);
  return res.status(200).json({
    success: true,
    message: "Notification removed",
  });
});

module.exports = {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
};
