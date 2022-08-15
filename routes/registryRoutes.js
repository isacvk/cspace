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
  .post(registryController.addEngagementReg);

router.route("/marriage-registry/:id").post(registryController.addMarriageReg);

router.route("/death-registry/:id").post(registryController.addDeathReg);

module.exports = router;
