const mongoose = require('mongoose');

const marriagesSchema = new mongoose.Schema({
  groomName: {
    type: String,
    required: [true, 'Name of the husband is not specified'],
  },
  brideName: {
    type: String,
    required: [true, 'Name of the wife is not specified'],
  },
  marriageDate: {
    type: Date,
    required: [true, 'Marriage date is not specified'],
  },
});

const Marriages = mongoose.model('Marriages', marriagesSchema);

module.exports = Marriages;
