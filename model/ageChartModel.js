const mongoose = require('mongoose');

const ageChartModel = new mongoose.Schema({
  category: {
    type: String,
  },
  male: {
    type: Number,
  },
  female: {
    type: Number,
  },
});

const AgeChart = mongoose.model('AgeChart', ageChartModel);

module.exports = AgeChart;
