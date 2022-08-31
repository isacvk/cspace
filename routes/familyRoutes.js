const express = require('express');

const authController = require('../controller/authController');
const familyController = require('../controller/familyController');

const router = express.Router();

router
  .route('/')
  .get(
    // authController.protect,
    familyController.getFamilies,
  )
  .post(familyController.addFamily);

router
  .route('/:id')
  .get(familyController.getFamily)
  .patch(
    familyController.uploadFamilyPhoto,
    familyController.resizeFamilyPhoto,
    familyController.updateFamily,
  );

module.exports = router;
