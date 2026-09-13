const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    eventKey: { type: String, required: true },
    type: {
      type: String,
      enum: ["added", "consumed", "expiring", "expired"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    occurredAt: { type: Date, required: true },
    read: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

notificationSchema.index({ userId: 1, eventKey: 1 }, { unique: true });

module.exports = mongoose.model("Notification", notificationSchema);
