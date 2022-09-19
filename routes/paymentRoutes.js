const express = require('express');

const paymentController = require('../controller/paymentController');
const authController = require('../controller/authController');

const router = express.Router();

router
  .route('/paynow/:id')
  .post(
    authController.protect,
    authController.restrictTo('User', 'Accountant'),
    paymentController.initiate,
  );
router.route('/callback').post(paymentController.callback);

module.exports = router;
