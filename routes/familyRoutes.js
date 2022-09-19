const express = require('express');

const authController = require('../controller/authController');
const familyController = require('../controller/familyController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('Admin', 'User', 'Accountant'),
    familyController.getFamilies,
  )
  .post(
    authController.protect,
    authController.restrictTo('Admin'),
    familyController.addFamily,
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('Admin', 'User', 'Accountant'),
    familyController.getFamily,
  )
  .patch(
    authController.protect,
    authController.restrictTo('User', 'Accountant'),
    familyController.uploadFamilyPhoto,
    familyController.resizeFamilyPhoto,
    familyController.updateFamily,
  );

module.exports = router;
