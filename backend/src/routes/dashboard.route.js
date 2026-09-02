const express=require("express")
const {protect}=require("../middleware/authMiddleware")
const router=express.Router()
const {dashboard}=require('../controllers/dashboardController')
router.get("/dashboard",protect,dashboard)

module.exports=router