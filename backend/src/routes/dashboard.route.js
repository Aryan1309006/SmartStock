const express=require("express")
const {protect}=require("../middleware/authMiddleware")
const router=express.Router()
const {dashboard}=require('../controllers/dashboardController')
router.get("/", protect, dashboard);

module.exports=router