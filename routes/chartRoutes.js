const express = require('express');

const chartController = require('../controller/chartController');

const router = express.Router();

router
  .route('/age-chart')
  .get(chartController.getAgeChart)
  .post(chartController.generateChartData);

router.route('/age-chart-category').get(chartController.createCategories);

module.exports = router;
