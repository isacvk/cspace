const express = require('express');

const personController = require('../controller/personController');
const authController = require('../controller/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('Admin', 'User', 'Accountant'),
    personController.getPersons,
  );

router
  .route('/add')
  .post(
    authController.protect,
    authController.restrictTo('Admin'),
    personController.newPerson,
  );

router
  .route('/add-member')
  .post(
    authController.protect,
    authController.restrictTo('Admin'),
    personController.newMember,
  );

router
  .route('/changes')
  .post(
    authController.protect,
    authController.restrictTo('User'),
    personController.proposeChange,
  );

router
  .route('/relations/:id')
  .get(
    authController.protect,
    authController.restrictTo('Admin'),
    personController.getPersonRelations,
  )
  .post(
    authController.protect,
    authController.restrictTo('Admin'),
    personController.addRelations,
  )
  .patch(
    authController.protect,
    authController.restrictTo('Admin'),
    personController.updateRelations,
  );

router
  .route('/birthdays')
  .get(
    authController.protect,
    authController.restrictTo('Admin'),
    personController.getBdayList,
  );

router
  .route('/id/:id')
  .get(
    authController.protect,
    authController.restrictTo('Admin', 'User', 'Accountant'),
    personController.getPerson,
  );

module.exports = router;
