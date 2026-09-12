const express=require("express")
const {protect}=require("../middleware/authMiddleware")
const router=express.Router()
const {
	dashboard,
	expiringSoon,
	recentlyConsumed,
    categoryCount,
} = require("../controllers/dashboardController");

router.get("/", protect, dashboard);
router.get("/expiring-soon", protect, expiringSoon);
router.get("/recently-consumed", protect, recentlyConsumed);
router.get("/category-count", protect, categoryCount);
module.exports=router
