const express = require('express');

const registryController = require('../controller/registryController');

const router = express.Router();

router.route('/baptism-registry').get(registryController.getBaptismRegs);
router.route('/engagement-registry').get(registryController.getEngagementRegs);
router.route('/marriage-registry').get(registryController.getMarriageRegs);
router.route('/death-registry').get(registryController.getDeathRegs);

router
  .route('/baptism-registry/:id')
  .get(registryController.getBaptismReg)
  .post(registryController.addBaptismReg)
  .patch(registryController.updateBaptismReg);

router
  .route('/engagement-registry/:id')
  .get(registryController.getEngagementReg)
  .post(registryController.addEngagementReg)
  .patch(registryController.updateEngagementReg);

// router.route('/marriage-registry').get(registryController.getMarriageRegs);

router
  .route('/marriage-registry/:id')
  .get(registryController.getMarriageReg)
  .post(registryController.addMarriageReg);

// router.route('/marriage-registry').get(registryController.getDeathRegs);

router
  .route('/death-registry/:id')
  .get(registryController.getDeathReg)
  .post(registryController.addDeathReg)
  .patch(registryController.updateDeathReg);

module.exports = router;
