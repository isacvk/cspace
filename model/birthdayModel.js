const mongoose = require('mongoose');

const birthdaySchema = new mongoose.Schema({
  baptismName: {
    type: String,
  },
  name: {
    type: String,
  },
  familyName: {
    type: String,
  },
});

const Birthdays = mongoose.model('Birthdays', birthdaySchema);

module.exports = Birthdays;
