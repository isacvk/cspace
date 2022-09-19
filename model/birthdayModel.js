const mongoose = require('mongoose');

const birthdaySchema = new mongoose.Schema({
  baptismName: {
    type: String,
    required: [true, 'Batism name not specified'],
  },
  name: {
    type: String,
  },
  familyName: {
    type: String,
    required: [true, 'Family name not specified'],
  },
});

const Birthdays = mongoose.model('Birthdays', birthdaySchema);

module.exports = Birthdays;
