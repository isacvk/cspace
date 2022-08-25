const express = require('express');

const offeringsController = require('../controller/offeringsController');

const router = express.Router();

router
  .route('/')
  .get(offeringsController.getOfferings)
  .post(offeringsController.createOffering);

router.route('/:id').get(offeringsController.getOffering);
// .post(paymentController.callback);

module.exports = router;
