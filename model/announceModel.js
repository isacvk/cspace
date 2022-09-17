const mongoose = require('mongoose');

const announceSchema = new mongoose.Schema({
  announcement: {
    type: String,
    required: [true, 'Please specify the announcement'],
  },
  date: {
    type: Date,
    required: [true, 'Date of announcement is not specified'],
  },
  visibility: {
    type: String,
    enum: ['private', 'public'],
    required: [true, 'Visibility of the announcement is not specified'],
  },
});

const Announce = mongoose.model('Announce', announceSchema);

module.exports = Announce;
