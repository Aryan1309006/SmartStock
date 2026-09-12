const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
	monthlyOverview,
	consumptionOverview,
} = require("../controllers/analyticsController");

router.get("/monthly-overview", protect, monthlyOverview);
router.get("/consumption-overview", protect, consumptionOverview);

module.exports = router;
