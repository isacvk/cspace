const mongoose = require('mongoose');

const offeringsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Payee name is not specified!'],
  },
  description: {
    type: String,
    required: [true, 'Description is not specified!'],
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is not specified!'],
  },
  createdAt: {
    type: Date,
    required: [true, 'Create date is not specified!'],
  },
  festDate: {
    type: Date,
    required: [true, 'Festival date is not specified!'],
  },
  isActive: {
    type: Boolean,
    default: true,
    required: [true, 'Status of offering is not specified!'],
  },
});

const Offerings = mongoose.model('Offerings', offeringsSchema);

module.exports = Offerings;
