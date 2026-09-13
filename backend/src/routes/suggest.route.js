const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { suggestRecipes } = require("../controllers/suggestRecipesController");

const router = express.Router();

router.post("/suggest", protect, suggestRecipes);

module.exports = router;