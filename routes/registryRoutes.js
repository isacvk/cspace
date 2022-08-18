const express = require("express");

const registryController = require("./../controller/registryController");

const router = express.Router();

router
  .route("/baptism-registry/:id")
  .get(registryController.getBaptismReg)
  .post(registryController.addBaptismReg)
  .patch(registryController.updateBaptismReg);

router
  .route("/engagement-registry/:id")
  .get(registryController.getEngagementReg)
  .post(registryController.addEngagementReg)
  .patch(registryController.updateEngagementReg);

router
  .route("/marriage-registry/:id")
  .get(registryController.getMarriageReg)
  .post(registryController.addMarriageReg);

router.route("/death-registry/:id").post(registryController.addDeathReg);

module.exports = router;
