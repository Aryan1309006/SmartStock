const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Pantry", "Dairy", "Medicine", "Toiletries", "Cleaning", "Other"],
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    purchaseDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    price: { type: Number, default: 0 },
    notes: { type: String },
    status: {
      type: String,
      enum: ["active", "consumed", "expired"],
      default: "active",
    },
    consumedAt: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Item", itemSchema);
