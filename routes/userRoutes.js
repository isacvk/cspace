const express = require('express');

const authController = require('../controller/authController');
const chartController = require('../controller/chartController');
const cronController = require('../controller/cronController');

const router = express.Router();

router.post(
  '/signup',
  authController.protect,
  authController.restrictTo('Admin'),
  authController.signup,
);

router
  .route('/signup/admin')
  .post(
    authController.protect,
    authController.restrictTo('Super-Admin'),
    authController.adminSignup,
  )
  .get(
    authController.protect,
    authController.restrictTo('Super-Admin'),
    authController.blockAdmin,
  );

router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgot-password', authController.forgotPass);
router.post('/verify-otp', authController.verifyOtp);
router.patch('/reset-password', authController.resetPass);

router.post('/to-lower', authController.toLower);

// TESTING ROUTES FOR DEVELOPER ONLY
router.get('/exp-offer', cronController.clearexpiredOfferings);
router.get('/bday-csv', cronController.createAnniversaryCsv);
module.exports = router;
