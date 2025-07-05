const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { updatePassword, login } = require("../services/authService");

router.post("/login", login);
router.patch("/users/:id", protect, updatePassword);

module.exports = router;