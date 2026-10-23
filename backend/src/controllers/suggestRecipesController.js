const Item = require("../models/item");
const { generateRecipes } = require("../config/Ai");
const sevedRecipes = require("../models/savedRecipes");
const FOOD_CATEGORIES = ["Pantry", "Dairy", "Other"];

const suggestRecipes = async (req, res) => {
  try {
    const { preferences = "", servings = 1, avoid = [] } = req.body || {};

    if (!Array.isArray(avoid)) {
      return res.status(400).json({
        success: false,
        message: "avoid must be an array",
      });
    }

    const parsedServings = Number(servings);
    if (!Number.isInteger(parsedServings) || parsedServings < 1) {
      return res.status(400).json({
        success: false,
        message: "servings must be a positive integer",
      });
    }

    const avoidItems = avoid.map((item) => String(item).toLowerCase());

    // Get user's active food inventory
    const items = await Item.find({
      userId: req.user.userId,
      status: { $ne: "consumed" },
      category: { $in: FOOD_CATEGORIES },
    })
      .sort({ expiryDate: 1 })
      .lean();

    // Remove avoided ingredients and expired items
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const availableItems = items.filter((item) => {
      // Exclude avoided items
      if (avoidItems.includes(String(item.name).toLowerCase())) return false;
      // Exclude manually marked expired items
      if (item.status === "expired") return false;

      // Exclude items past their expiry date
      const expiry = new Date(item.expiryDate);
      expiry.setHours(0, 0, 0, 0);
      return expiry >= today;
    });

    if (availableItems.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          recipes: [],
          ingredients: [],
          message: "Add available food items to receive recipe suggestions.",
        },
      });
    }

    // Create JSON that will be sent to AI
    const recipeData = {
      preferences,
      servings: parsedServings,
      avoid: avoidItems,

      items: availableItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        expiryDate: item.expiryDate,
      })),
    };

    // Send JSON to AI service
    const aiResult = await generateRecipes(recipeData);

    // Return AI JSON to frontend
    return res.status(200).json({
      success: true,
      data: aiResult,
    });
  } catch (error) {
    console.error("Suggest Recipes Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create recipe suggestions",
    });
  }
};

const saveRecipe = async (req, res) => {
  try {
    const {
      name,
      ingredients,
      steps,
      prepTime,
      servings,
      usesInventory,
      inventoryItemsUsed,
      missingIngredients,
    } = req.body;

    // Validate required fields
    if (!name || !ingredients || !steps) {
      return res.status(400).json({
        success: false,
        message: "Incomplete recipe details",
      });
    }

    const userId = req.user.userId;

    const savedRecipe = await SavedRecipe.create({
      userId,
      name,
      ingredients,
      steps,
      prepTime,
      servings,
      usesInventory,
      inventoryItemsUsed,
      missingIngredients,
    });

    return res.status(201).json({
      success: true,
      message: "Recipe saved successfully",
      data: savedRecipe,
    });
  } catch (error) {
    console.error("Save recipe error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save recipe",
      error: error.message,
    });
  }
};
module.exports = {
  suggestRecipes,
};
