const express = require('express');

const paymentController = require('../controller/paymentController');
const authController = require('../controller/authController');

const router = express.Router();

router.route('/paynow/:id').post(paymentController.initiate);
router.route('/callback').post(paymentController.callback);
// router.route("/").get().post(paymentController.callback);

module.exports = router;
