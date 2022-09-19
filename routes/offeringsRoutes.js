const express = require('express');

const offeringsController = require('../controller/offeringsController');
const authController = require('../controller/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('Admin', 'Accountant', 'User'),
    offeringsController.getOfferings,
  )
  .post(
    authController.protect,
    authController.restrictTo('Admin'),
    offeringsController.createOffering,
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('Admin', 'User', 'Accountant'),
    offeringsController.getOffering,
  );

router
  .route('/:id/sponsors')
  .get(
    authController.protect,
    authController.restrictTo('Admin', 'User', 'Accountant'),
    offeringsController.getSponsors,
  );

router
  .route('/generate-csv/:id')
  .get(
    authController.protect,
    authController.restrictTo('Admin'),
    offeringsController.generateCsv,
  );

module.exports = router;
