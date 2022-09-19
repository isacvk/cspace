const express = require('express');

const authController = require('../controller/authController');
const mailController = require('../controller/mailController');

const router = express.Router();

router.post(
  '/',
  authController.protect,
  authController.restrictTo('Admin'),
  mailController.uploadAttachment,
  mailController.sendMail,
);

module.exports = router;
