const mongoose = require('mongoose');
const Family = require('./familyModel');

// TODO: FAMILY ID SHOULD BE REQUIRED
// TODO: CHANGE TO PHONENUM
const personSchema = new mongoose.Schema(
  {
    changeProposed: {
      type: Boolean,
      default: false,
    },
    changeId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Parishioners',
    },
    privacyEnabled: {
      type: Boolean,
      default: false,
    },
    familyId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Families',
      required: [true, 'Family Id is required!'],
    },
    familyName: {
      type: String,
      required: [true, 'Family name is required!'],
    },
    baptismName: {
      type: String,
      required: [true, 'Please tell us your baptism name!'],
    },
    name: {
      type: String,
    },
    dob: {
      type: Date,
    },
    age: {
      type: Number,
    },
    dobDay: {
      type: Number,
    },
    dobMonth: {
      type: Number,
    },
    doBaptism: {
      type: Date,
    },
    marriage: {
      type: Date,
    },
    dod: {
      type: Date,
    },
    phoneNumber: {
      type: Number,
    },
    whatsappNum: {
      type: Number,
    },
    email: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['M', 'F'],
      required: [true, 'Please specify the genders of the person'],
    },
    maritalStatus: {
      type: String,
      enum: [
        'single',
        'engaged',
        'married',
        'divorced',
        'hus-exp',
        'wife-exp',
        'Reg-To-Be-Added',
      ],
      default: 'single',
      required: [true, 'Marital status is not specified'],
    },
    isActive: {
      type: Boolean,
      default: true,
      required: [true, 'Active status is required'],
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

// personSchema.virtual('age').get(function () {
//   const birthDate = this.dob;
//   console.log(birthDate, this.dob);
//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const m = today.getMonth() - birthDate.getMonth();
//   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//     age -= 1;
//   }
//   return age;
// });

personSchema.post('save', async function (doc, next) {
  if (!doc.changeId) {
    const family = await Family.findOneAndUpdate(
      {
        _id: doc.familyId,
      },
      {
        $push: {
          members: {
            _id: doc._id,
          },
        },
      },
    );
  }
});

const Parishioners = mongoose.model('Parishioners', personSchema);

module.exports = Parishioners;
