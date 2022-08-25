const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Parishioners',
  },
  offeringId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Offerings',
  },
  baptismName: {
    type: String,
    required: [true, 'Payee name is not specified!'],
  },
  phoneNum: {
    type: Number,
    required: [true, 'Phone number is not specified!'],
  },
  description: {
    type: String,
  },
  orderId: {
    type: String,
    required: [true, 'Order Id is not specified!'],
  },
  status: {
    type: String,
    enum: ['initiated', 'paid'],
    default: 'initiated',
  },
  paidAt: {
    type: Date,
  },
});

const Sponsors = mongoose.model('Sponsors', sponsorSchema);

module.exports = Sponsors;
