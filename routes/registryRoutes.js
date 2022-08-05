const express = require("express");

const registryController = require("./../controller/registryController");

const router = express.Router();

router
  .route("/baptism-registry/:id")
  .post(registryController.addBaptismRegistry);

router
  .route("/engagement-registry/:id")
  .post(registryController.addEngagementRegistry);

router
  .route("/marriage-registry/:id")
  .post(registryController.addMarriageRegistry);

router.route("/death-registry/:id").post(registryController.addDeathRegistry);

module.exports = router;
