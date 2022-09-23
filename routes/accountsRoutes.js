const express = require('express');

const authController = require('../controller/authController');
const accountsController = require('../controller/accountsController');

const router = express.Router();

router.route('/').post(accountsController.createAccount);
router
  .route('/groups')
  .get(
    authController.protect,
    authController.restrictTo('Admin', 'Accountant'),
    accountsController.getGroups,
  )
  .post(
    authController.protect,
    authController.restrictTo('Accountant'),
    accountsController.createGroup,
  );

router
  .route('/ledgers')
  .get(
    authController.protect,
    authController.restrictTo('Admin', 'Accountant'),
    accountsController.getLedgers,
  )
  .post(
    authController.protect,
    authController.restrictTo('Accountant'),
    accountsController.createLedger,
  );

router
  .route('/vouchers')
  .get(
    authController.protect,
    authController.restrictTo('Admin', 'Accountant'),
    accountsController.getVouchers,
  )
  .post(
    authController.protect,
    authController.restrictTo('Accountant'),
    accountsController.createVoucher,
  );

router
  .route('/vouchers/generate-csv')
  .get(
    authController.protect,
    authController.restrictTo('Admin', 'Accountant'),
    accountsController.createCSV,
  );

router
  .route('/vouchers/:id')
  .get(
    authController.protect,
    authController.restrictTo('Admin', 'Accountant'),
    accountsController.getVoucherUnderLedger,
  );

// router
//   .route("/:id")
//   .get()
//   .patch();

module.exports = router;
