const express = require('express');

const authController = require('../controller/authController');
const messageController = require('../controller/messageController');

const router = express.Router();

router.post(
  '/person/:id',
  authController.protect,
  authController.restrictTo('Admin'),
  messageController.person,
);

router.post(
  '/family/:id',
  authController.protect,
  authController.restrictTo('Admin'),
  messageController.family,
);

router.post(
  '/',
  authController.protect,
  authController.restrictTo('Admin'),
  messageController.sendMessage,
);

module.exports = router;
