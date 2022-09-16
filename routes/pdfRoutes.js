const express = require('express');

const authController = require('../controller/authController');
const pdfController = require('../controller/pdfController');

const router = express.Router();

router.get(
  '/person/:id',
  //   authController.protect,
  //   authController.restrictTo("Admin"),
  pdfController.personPdf,
);

router.get(
  '/marriage/:id',
  //   authController.protect,
  //   authController.restrictTo("Admin"),
  pdfController.marriagePdfInfo,
);

router.get(
  '/baptism/:id',
  //   authController.protect,
  //   authController.restrictTo("Admin"),
  pdfController.baptismPdfInfo,
);

module.exports = router;
