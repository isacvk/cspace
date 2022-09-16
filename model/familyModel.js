const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
  familyName: {
    type: String,
    required: [true, 'Please speceify the family name'],
  },
  address: {
    type: String,
    required: [true, 'Please specify the address'],
  },
  houseNum: {
    type: String,
    required: [true, 'Please specify the house number'],
  },
  wardNum: {
    type: Number,
    required: [true, 'Please specify the ward number'],
  },
  parishId: {
    type: String,
    // required: [true, 'parish ID not specified'],
  },
  pin: {
    type: Number,
    required: [true, 'Please specify the pin number'],
  },
  familyHead: String,
  familyHeadId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Parishioners',
  },
  members: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Parishioners',
    },
  ],
  photo: {
    type: String,
  },
  remarks: {
    type: String,
  },
});

const Families = mongoose.model('Families', familySchema);

module.exports = Families;
