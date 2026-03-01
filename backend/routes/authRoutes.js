const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  googleLogin, // 🔥 NEW
} = require("../controllers/authController");

// 📝 Register Route
router.post("/register", registerUser);

// 🔑 Login Route
router.post("/login", loginUser);

// 🔥 Google Login Route (NEW — safe addition)
router.post("/google", googleLogin);

module.exports = router;