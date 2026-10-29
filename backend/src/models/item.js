const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Pantry", "Dairy", "Medicine", "Toiletries", "Cleaning", "Other"],
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    purchaseDate: { type: String, required: true, trim: true },
    expiryDate: { type: String, required: true, trim: true },
    price: { type: Number, default: 0, min: 0 },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "consumed", "expired"],
      default: "active",
    },
    consumedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// Indexes for fast user queries
itemSchema.index({ userId: 1, status: 1, expiryDate: 1 });
itemSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.models.Item || mongoose.model("Item", itemSchema);
