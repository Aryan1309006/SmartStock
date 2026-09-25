const mongoose = require("mongoose");

const savedRecipesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      require: true,
    },
    ingredients: {
      type: [String],
      require: true,
    },
    steps: {
      type: [String],
      require: true,
    },
    prepTime: {
      type: Number,
      required: true,
    },
    servings: {
      type: Number,
      required: true,
    },
    usesInventory: {
      type: Boolean,
      required: true,
    },
    inventoryItemsUsed: {
      type: [String],
      require: true,
    },
    missingIngredients: {
      type: [String],
      require: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("sevedREcipes", savedRecipesSchema);
