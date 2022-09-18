const express = require('express');

const authController = require('../controller/authController');
const announceController = require('../controller/announceController');

const router = express.Router();

router.route('/public').get(announceController.getAnnouncementPublic);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('Admin', 'Users', 'Accountant'),
    announceController.getAnnouncementUsers,
  )
  .post(announceController.announce);
router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('Admin'),
    announceController.modifyAnnounce,
  );
router
  .route('/:id')
  .delete(
    authController.protect,
    authController.restrictTo('Admin'),
    announceController.deleteAnnounce,
  );
module.exports = router;
