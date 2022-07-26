const express = require("express")

const familyController = require("./../controller/familyController")

const router = express.Router();

router.post("/",familyController.addFamily)
router.get("/",familyController.getFamily)

module.exports = router;