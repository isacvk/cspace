const express = require("express");

const personController = require("./../controller/personController");

const router = express.Router();

router.post("/", personController.newPerson);

router.get("/", personController.getPerson);

module.exports = router;
