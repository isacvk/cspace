const express = require('express');

const authController = require('../controller/authController');
const accountsController = require('../controller/accountsController');

const router = express.Router();

router.route('/').post(accountsController.createAccount);
router
  .route('/groups')
  .get(accountsController.getGroups)
  .post(accountsController.createGroup);

router
  .route('/ledgers')
  .get(accountsController.getLedgers)
  .post(accountsController.createLedger);

router
  .route('/vouchers')
  .get(accountsController.getVouchers)
  .post(accountsController.createVoucher);

// router
//   .route("/:id")
//   .get()
//   .patch();

module.exports = router;
