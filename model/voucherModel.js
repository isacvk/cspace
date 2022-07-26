const mongoose = require('mongoose');

const Accounts = require('./accountsModel');

const voucherSchema = new mongoose.Schema({
  voucherNum: {
    type: Number,
    required: [true, 'Voucher number is not specified!'],
    unique: true,
  },
  account: {
    type: String,
    enum: ['cash', 'bank'],
    required: [true, 'account is not specified!'],
  },
  date: {
    type: Date,
    required: [true, 'Date is not specified!'],
  },
  narration: {
    type: String,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is not specified!'],
  },
  groupId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Groups',
    required: [true, 'Group Id is not specified!'],
  },
  groupName: {
    type: String,
    required: [true, 'Group name is not specified!'],
  },
  ledgerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Groups',
    required: [true, 'Ledger Id is not specified!'],
  },
  ledgerName: {
    type: String,
    required: [true, 'Ledger name is not specified!'],
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'please specify the type of group!'],
  },
});

voucherSchema.post('save', async (doc, next) => {
  if (doc.type === 'income') {
    if (doc.account === 'cash') {
      console.log('ENTERED!!!');
      const addAmount = await Accounts.findOneAndUpdate(
        { id: '630c3ff0a5e0c2f879995b07' },
        {
          $inc: { cash: doc.amount },
        },
      );

      console.log('ADDAMT : ', addAmount);
    }
  }
  next();
});

const Voucher = mongoose.model('Voucher', voucherSchema);

module.exports = Voucher;
