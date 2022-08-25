const mongoose = require('mongoose');
const Family = require('./familyModel');

const personSchema = new mongoose.Schema(
  {
    familyId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Families',
    },
    // parishId: {
    //   type: String,
    //   required: [true, "Parish Id is not specified"],
    // },
    firstName: {
      type: String,
      required: [true, 'Please tell us your first name!'],
    },
    lastName: {
      type: String,
      // required: [true, "Please tell us your last name!"],
    },
    dob: {
      type: Date,
      // required: [true, "Please tell us your date of birth"],
    },
    baptism: {
      type: Date,
      // required: [true, "Please tell us your baptism date"],
    },
    marriage: {
      type: Date,
      // required: [true, "Please tell us your marriage date"],
    },
    death: {
      type: Date,
    },
    phoneNumber: {
      type: Number,
      // required: [true, "Please enter your contact number!"],
    },
    gender: {
      type: String,
      enum: ['M', 'F'],
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'engaged', 'married', 'divorced', 'hus-exp', 'wife-exp'],
      default: 'single',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    wardNo: {
      type: Number,
      required: [true, 'Please specify ward number'],
    },
    father: {
      type: mongoose.Schema.ObjectId,
      ref: 'Parishioners',
    },
    mother: {
      type: mongoose.Schema.ObjectId,
      ref: 'Parishioners',
    },
    brothers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Parishioners',
      },
    ],
    sisters: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Parishioners',
      },
    ],
    wife: {
      type: mongoose.Schema.ObjectId,
      ref: 'Parishioners',
    },
    husband: {
      type: mongoose.Schema.ObjectId,
      ref: 'Parishioners',
    },
    sons: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Parishioners',
      },
    ],
    daughters: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Parishioners',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

personSchema.virtual('age').get(function () {
  const birthDate = this.dob;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
});

personSchema.post('save', async function (next) {
  const family = await Family.findOneAndUpdate(
    {
      _id: this.familyId,
    },
    {
      $push: {
        members: {
          _id: this._id,
        },
      },
    },
  );
});

const Parishioners = mongoose.model('Parishioners', personSchema);

module.exports = Parishioners;
