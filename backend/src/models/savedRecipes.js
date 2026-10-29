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
      required: true,
      trim: true,
    },
    ingredients: {
      type: [String],
      required: true,
      default: [],
    },
    steps: {
      type: [String],
      required: true,
      default: [],
    },
    prepTime: {
      type: Number,
      required: true,
      default: 20,
    },
    servings: {
      type: Number,
      required: true,
      default: 2,
    },
    usesInventory: {
      type: Boolean,
      default: true,
    },
    inventoryItemsUsed: {
      type: [String],
      default: [],
    },
    missingIngredients: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

// Register model with fallback compatibility
module.exports = mongoose.models.SavedRecipe || mongoose.model("SavedRecipe", savedRecipesSchema, "savedrecipes");
