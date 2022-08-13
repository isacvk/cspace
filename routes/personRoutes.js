const express = require("express");

const personController = require("./../controller/personController");

const router = express.Router();

router
  .route("/")
  .get(personController.getPersons)
  .post(personController.newPerson);

router.route("/add").post(personController.newPerson2);
router
  .route("/relations/:id")
  .get(personController.getPersonRelations)
  .post(personController.addRelations)
  .patch(personController.updateRelations);

router.route("/id/:id").get(personController.getPerson);

module.exports = router;
