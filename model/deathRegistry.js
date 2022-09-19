const mongoose = require('mongoose');

const Parishioners = require('./personModel');
const MarriageReg = require('./marriageRegistry');
const EngagementReg = require('./engagementModel');
const Users = require('./userModel');

const chartController = require('../controller/chartController');

const deathRegSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Parishioners',
    required: [true, 'Please specify the user Id of the person'],
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
  wardNo: {
    type: Number,
    required: [true, 'Ward number is not specified'],
  },
  baptismName: {
    type: String,
    required: [true, 'Please specify the baptism name'],
  },
  dob: {
    type: Date,
    required: [true, 'Dob of the person is not specified'],
  },
  age: {
    type: Number,
    required: [true, 'Please specify the age'],
  },
  sickness: {
    type: String,
  },
  sacraments: {
    confession: {
      type: Boolean,
      required: [true, 'Please specify whether or not confessed'],
    },
    viaticum: {
      type: Boolean,
      required: [true, 'Please specify viaticum'],
    },
    anointing: {
      type: Boolean,
      requied: [true, 'Please specify anointing'],
    },
  },
  dod: {
    type: Date,
    required: [true, 'Please specify the date of death'],
  },
  doBurial: {
    type: Date,
    required: [true, 'Please specify the date of burial'],
  },
  parishPriest: {
    type: String,
    required: [true, 'Please specify the parish priest'],
  },
  place: {
    type: String,
    required: [true, 'Please specify the place of death'],
  },
  remarks: {
    type: String,
  },
});

deathRegSchema.post('save', async (doc, next) => {
  // console.log("DEATH DOC : ", doc);
  const updateStats = await Parishioners.findByIdAndUpdate(doc.userId, {
    dod: doc.dod,
    isActive: false,
  });

  const user = await Parishioners.findById(doc.userId);

  if (user.gender === 'M' && user.wife) {
    const engagementStatus = await EngagementReg.findOneAndUpdate(
      { brideId: user.wife, status: 'valid' },
      {
        status: 'invalid',
      },
    );
    const marriageStatus = await MarriageReg.findOneAndUpdate(
      { brideId: user.wife, status: 'valid' },
      {
        status: 'invalid',
      },
    );
    const wifeStatus = await Parishioners.findByIdAndUpdate(user.wife, {
      maritalStatus: 'single',
    });
  }

  if (updateStats.gender === 'F' && user.husband) {
    const husbandStatus = await Parishioners.findByIdAndUpdate(user.husband, {
      maritalStatus: 'single',
    });
    const engagementStatus = await EngagementReg.findOneAndUpdate(
      { brideId: user.wife, status: 'valid' },
      {
        status: 'invalid',
      },
    );
    const marriageStatus = await MarriageReg.findOneAndUpdate(
      { brideId: user.wife, status: 'valid' },
      {
        status: 'invalid',
      },
    );
  }
  if (user.loginAccess) {
    const userLogin = await Users.findOneAndUpdate(
      { userId: user._id },
      {
        isActive: false,
      },
    );
  }
  next();

  next();
});

deathRegSchema.post('save', async (doc, next) => {
  chartController.generateChartData();
  next();
});

const DeathReg = mongoose.model('DeathReg', deathRegSchema);

module.exports = DeathReg;
