const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  suggestRecipes,
  saveRecipe,
  getSavedRecipes,
} = require("../controllers/suggestRecipesController");

const router = express.Router();

router.post("/suggest", protect, suggestRecipes);
router.post("/save", protect, saveRecipe);
router.get("/saved", protect, getSavedRecipes);

module.exports = router;