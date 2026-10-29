// Backward-compatible adapter forwarding to recipeService
const recipeService = require("../services/recipeService");

module.exports = {
  generateRecipes: async (recipeData) => {
    // Adapter for legacy callers
    const result = await recipeService.suggestRecipes(recipeData.userId || null, recipeData);
    return result;
  },
};