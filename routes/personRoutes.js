const express = require("express");

const personController = require("./../controller/personController");

const router = express.Router();

router
  .route("/")
  .get(personController.getPersons)
  .post(personController.newPerson);

router.route("/add").post(personController.newPerson2);

router.route("/id/:id").get(personController.getPerson);

module.exports = router;
