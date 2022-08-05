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

module.exports = router;
