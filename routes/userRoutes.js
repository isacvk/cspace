const express = require("express");

const authController = require("../controller/authController");

const router = express.Router();

router.post(
  "/signup",
  authController.protect,
  authController.restrictTo("Admin"),
  authController.signup
);
router.post("/login", authController.login);

router.post("/forgot-password", authController.forgotPass);
router.post("/verify-otp", authController.verifyOtp);
router.patch("/reset-password", authController.resetPass);

module.exports = router;
