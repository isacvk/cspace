const express = require('express');

const offeringsController = require('../controller/offeringsController');

const router = express.Router();

router
  .route('/')
  .get(offeringsController.getOfferings)
  .post(offeringsController.createOffering);

router.route('/:id').get(offeringsController.getOffering);
// .post(paymentController.callback);

router.route('/generate-csv/:id').get(offeringsController.generateCsv);

module.exports = router;
