const express = require("express");

const authController = require("./../controller/authController");
const announceController = require("./../controller/announceController");

const router = express.Router();

router
  .route("/")
  .get(announceController.getAnnouncement)
  .post(announceController.announce);
router.route("/:id").patch(announceController.modifyAnnounce);
router.route("/:id").delete(announceController.deleteAnnounce);

// router
//   .route("/:id")
//   .get()
//   .patch();

module.exports = router;
