const recipeService = require("../services/recipeService");
const asyncHandler = require("../middleware/asyncHandler");

const suggestRecipes = asyncHandler(async (req, res) => {
  const result = await recipeService.suggestRecipes(req.user.userId, req.body);
  return res.status(200).json({
    success: true,
    data: result,
  });
});

const saveRecipe = asyncHandler(async (req, res) => {
  const savedRecipe = await recipeService.saveRecipe(req.user.userId, req.body);
  return res.status(201).json({
    success: true,
    message: "Recipe saved successfully",
    data: savedRecipe,
  });
});

const getSavedRecipes = asyncHandler(async (req, res) => {
  const recipes = await recipeService.getSavedRecipes(req.user.userId);
  return res.status(200).json({
    success: true,
    data: { recipes },
  });
});

module.exports = {
  suggestRecipes,
  saveRecipe,
  getSavedRecipes,
};
