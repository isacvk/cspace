const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  cash: {
    type: Number,
  },
  bank: {
    type: Number,
  },
});

const Accounts = mongoose.model('Accounts', accountSchema);

module.exports = Accounts;
