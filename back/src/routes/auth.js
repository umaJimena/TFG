const express = require("express");
const {
  register,
  login,
  me,
  verifyEmail,
  resendVerificationCode,
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.post("/verify-email", requireAuth, verifyEmail);
router.post("/resend-code", requireAuth, resendVerificationCode);

module.exports = router;
