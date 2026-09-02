const express = require("express");

const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  register,
  login,
  getme,
  logout,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/me", protect, getme);

module.exports = router;
