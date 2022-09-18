const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Parishioners',
  },
  offeringId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Offerings',
    required: [true, 'Offering Id is not specified!'],
  },
  baptismName: {
    type: String,
    required: [true, 'Payee name is not specified!'],
  },
  familyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Families',
  },
  familyName: {
    type: String,
    required: [true, 'Family name is not specified!'],
  },
  phoneNum: {
    type: Number,
    required: [true, 'Phone number is not specified!'],
  },
  description: {
    type: String,
    required: [true, 'Description is not specified!'],
  },
  orderId: {
    type: String,
    required: [true, 'Order Id is not specified!'],
  },
  status: {
    type: String,
    enum: ['initiated', 'paid'],
    default: 'initiated',
    required: [true, 'Status is not specified!'],
  },
  paidAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    required: [true, 'Initiate date is not specified'],
  },
});

const Sponsors = mongoose.model('Sponsors', sponsorSchema);

module.exports = Sponsors;
