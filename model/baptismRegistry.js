const mongoose = require('mongoose');

const Parishioners = require('./personModel');

const baptismSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Parishioners',
    required: [true, 'User Id is not specified'],
    unique: true,
  },
  familyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Families',
    required: [true, 'Family Id is not specified'],
  },
  familyName: {
    type: String,
    required: [true, 'Family name is not specified'],
  },
  baptismName: {
    type: String,
    required: [true, 'Baptism name is not specified'],
  },
  name: {
    type: String,
  },
  father: {
    type: String,
    required: [true, 'Father name is not specified'],
  },
  mother: {
    type: String,
    required: [true, 'Mother name is not specified'],
  },
  dob: {
    type: Date,
    required: [true, 'DOB is not specified'],
  },
  doBaptism: {
    type: Date,
    required: [true, 'Date of baptism is not specified'],
  },
  birthPlace: {
    type: String,
    required: [true, 'Place of bith is not specified'],
  },
  parish: {
    type: String,
    required: [true, 'Parish is not specified'],
  },
  godFather: {
    name: {
      type: String,
      required: [true, 'God father name is not specified'],
    },
    parish: {
      type: String,
      required: [true, 'Parish of the god father is not specified'],
    },
  },
  godMother: {
    name: {
      type: String,
      required: [true, 'God mother name is not specified'],
    },
    parish: {
      type: String,
      required: [true, 'Parish of the god father is not specified'],
    },
  },
  minister: {
    type: String,
    required: [true, 'Minister name is not specified'],
  },
  parishPriest: {
    type: String,
    required: [true, 'Parish priest name is not specified'],
  },
  remarks: {
    type: String,
  },
});

baptismSchema.post('save', async function (doc, next) {
  const birthDate = doc.dob;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  const day = doc.dob.getDate();
  const month = doc.dob.getMonth() + 1;
  const updateDate = await Parishioners.findByIdAndUpdate(
    { _id: this.userId },
    {
      $set: {
        dob: doc.dob,
        doBaptism: doc.doBaptism,
        dobDay: day,
        dobMonth: month,
        age,
      },
    },
  );
  next();
});

const BaptismReg = mongoose.model('BaptismReg', baptismSchema);

module.exports = BaptismReg;
