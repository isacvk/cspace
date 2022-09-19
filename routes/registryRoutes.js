const express = require('express');

const registryController = require('../controller/registryController');
const authController = require('../controller/authController');

const router = express.Router();

router
  .route('/baptism-registry')
  .get(
    authController.protect,
    authController.restrictTo('Admin'),
    registryController.getBaptismRegs,
  );
router
  .route('/engagement-registry')
  .get(
    authController.protect,
    authController.restrictTo('Admin'),
    registryController.getEngagementRegs,
  );
router
  .route('/marriage-registry')
  .get(
    authController.protect,
    authController.restrictTo('Admin'),
    registryController.getMarriageRegs,
  );
router
  .route('/death-registry')
  .get(
    authController.protect,
    authController.restrictTo('Admin'),
    registryController.getDeathRegs,
  );

router
  .route('/baptism-registry/:id')
  .get(
    authController.protect,
    authController.restrictTo('Admin', 'User', 'Accoutant'),
    registryController.getBaptismReg,
  )
  .post(
    authController.protect,
    authController.restrictTo('Admin'),
    registryController.addBaptismReg,
  )
  .patch(
    authController.protect,
    authController.restrictTo('Admin'),
    registryController.updateBaptismReg,
  );

router
  .route('/engagement-registry/:id')
  .get(
    authController.protect,
    authController.restrictTo('Admin', 'User', 'Accountant'),
    registryController.getEngagementReg,
  )
  .post(
    authController.protect,
    authController.restrictTo('Admin'),
    registryController.addEngagementReg,
  )
  .patch(
    authController.protect,
    authController.restrictTo('Admin'),
    registryController.updateEngagementReg,
  );

// router.route('/marriage-registry').get(registryController.getMarriageRegs);

router
  .route('/marriage-registry/:id')
  .get(
    authController.protect,
    authController.restrictTo('Admin', 'User', 'Accountant'),
    registryController.getMarriageReg,
  )
  .post(
    authController.protect,
    authController.restrictTo('Admin'),
    registryController.addMarriageReg,
  );

// router.route('/marriage-registry').get(registryController.getDeathRegs);

router
  .route('/death-registry/:id')
  .get(
    authController.protect,
    authController.restrictTo('Admin', 'User', 'Accountant'),
    registryController.getDeathReg,
  )
  .post(
    authController.protect,
    authController.restrictTo('Admin'),
    registryController.addDeathReg,
  )
  .patch(
    authController.protect,
    authController.restrictTo('Admin'),
    registryController.updateDeathReg,
  );

module.exports = router;
