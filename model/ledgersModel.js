const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name of the ledger is not specified!'],
  },
  groupId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Groups',
    required: [true, 'group id is not specified!'],
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'please specify the type of Ledger!'],
  },
});

const Ledger = mongoose.model('Ledger', ledgerSchema);

module.exports = Ledger;
