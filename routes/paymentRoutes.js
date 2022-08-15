const express = require("express");

const paymentController = require("./../controller/paymentController");

const router = express.Router();

router.route("/paynow").get().post(paymentController.initiate);
router.route("/callback").get().post(paymentController.callback);
// router.route("/").get().post(paymentController.callback);

module.exports = router;
