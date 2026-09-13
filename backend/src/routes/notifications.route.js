const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} = require("../controllers/notificationsController");

const router = express.Router();

router.use(protect);
router.get("/", listNotifications);
router.patch("/:id/read", markNotificationRead);
router.patch("/read-all", markAllNotificationsRead);
router.delete("/:id", deleteNotification);

module.exports = router;
