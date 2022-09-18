const express = require('express');

const chartController = require('../controller/chartController');
const cronController = require('../controller/cronController');

const router = express.Router();

router
  .route('/age-chart')
  .get(chartController.getAgeChart)
  .post(chartController.generateChartData);

router.route('/age-chart-category').get(chartController.createCategories);
router.route('/sponsors').get(cronController.clearSponsorTable);

module.exports = router;
