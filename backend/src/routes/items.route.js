const express=require("express")
const router=express.Router()
const {protect}=require('../middleware/authMiddleware')
const {createItem,showAll,showOne,updateOne,deleteOne,markConsume,restore} =require("../controllers/itemsController")

router.post("/",protect, createItem);
router.get("/",protect,showAll)
router.get("/:id",protect,showOne)
router.put("/:id",protect,updateOne)
router.delete("/:id",protect,deleteOne)
router.patch("/:id/consume",protect,markConsume)
router.patch("/:id/restore",protect,restore)

module.exports = router;