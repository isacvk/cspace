const mongoose = require('mongoose');

const offeringsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Payee name is not specified!'],
  },
  description: {
    type: String,
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is not specified!'],
  },
  createdAt: {
    type: Date,
  },
  festDate: {
    type: Date,
    required: [true, 'Festival date is not specified!'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Offerings = mongoose.model('Offerings', offeringsSchema);

module.exports = Offerings;
