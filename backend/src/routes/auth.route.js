const express = require("express");

const router = express.Router();
const {
  register,
  login,
  getme,
  logout,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getme);

module.exports = router;
