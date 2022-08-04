const express = require("express");

const familyController = require("./../controller/familyController");

const router = express.Router();

router
  .route("/")
  .get(familyController.getFamilies)
  .post(familyController.addFamily);

router.route("/:id").get(familyController.getFamily);

module.exports = router;
