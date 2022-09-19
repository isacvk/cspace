const mongoose = require('mongoose');

const Parishioners = require('./personModel');
const Family = require('./familyModel');
const EngagementReg = require('./engagementModel');

const marriageRegSchema = new mongoose.Schema({
  groomId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Parishioners',
  },
  brideId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Parishioners',
  },
  groomName: {
    type: String,
    required: [true, 'Groom name is not specified'],
  },
  groomAge: {
    type: Number,
    required: [true, 'Age of groom is not specified'],
  },
  brideName: {
    type: String,
    required: [true, 'Bride name is not specified'],
  },
  brideAge: {
    type: Number,
    required: [true, 'Age of bride is not specified'],
  },
  status: {
    type: String,
    enum: ['valid', 'divorced', 'invalid'],
    default: 'valid',
    required: [true, 'Marriage status is not specified'],
  },
  marriageDate: {
    type: Date,
    required: [true, 'Please provide marriage date'],
  },
  celebrant: {
    type: String,
    required: [true, 'Please provide the celebrant name'],
  },
  parishPriest: {
    type: String,
    required: [true, 'Parish priest name is not specified'],
  },
  remarks: {
    type: String,
  },
  witness: {
    type: String,
    required: [true, 'Witness name is not specified'],
  },
  marriageDay: {
    type: Number,
  },
  marriageMonth: {
    type: Number,
  },
});

marriageRegSchema.pre('save', async function (next) {
  this.marriageDay = this.marriageDate.getDate();
  this.marriageMonth = this.marriageDate.getMonth() + 1;
  console.log(this);
});

marriageRegSchema.post('save', async function (doc, next) {
  //* WHEN BRIDE IS FROM ANOTHR PARISH
  if (this.groomId && !this.brideId) {
    const familyInfo = await Parishioners.findById(this.groomId).select(
      'familyId wardNo familyName',
    );
    console.log('FAM INFO : ', familyInfo);

    let brideData = await EngagementReg.findOne({
      groomId: this.groomId,
      status: 'valid',
    }).select('brideData groomData');

    brideData = brideData.brideData;
    console.log('BRIDE INFO : ', brideData);

    const addToParishioners = await Parishioners.create({
      familyId: familyInfo.familyId,
      familyName: familyInfo.familyName,
      wardNo: familyInfo.wardNo,
      baptismName: brideData.baptismName,
      dob: brideData.dob,
      baptism: brideData.baptism,
      husband: this.groomId,
      maritalStatus: 'married',
      gender: 'F',
      marriage: doc.marriageDate,
      outsideBride: true,
    });

    console.log('PERSONS : ', addToParishioners);

    const updateBrideIdEngReg = await EngagementReg.findOneAndUpdate(
      { groomId: this.groomId },
      { brideId: addToParishioners._id },
    );

    const updateGroomRef = await Parishioners.findByIdAndUpdate(this.groomId, {
      wife: addToParishioners._id,
    });

    console.log('ENG ID : ', updateBrideIdEngReg);

    const updateBrideIdMarReg = await marriageReg.findOneAndUpdate(
      { groomId: this.groomId },
      { brideId: addToParishioners._id },
    );
  }
  next();
});

// marriageRegSchema.pre('save', async function (doc, next) {
//   //* WHEN GROOM IS FROM ANOTHR PARISH
//   if (!this.groomId && this.brideId) {

//   }
// })

marriageRegSchema.post('save', async function (doc, next) {
  //* WHEN GROOM IS FROM ANOTHR PARISH
  if (!doc.groomId && doc.brideId) {
    console.log('DOC.BRIDE ID : ', doc);
    const updateIsActive = await Parishioners.findByIdAndUpdate(this.brideId, {
      isActive: false,
      marriage: doc.marriageDate,
    });
    next();
  }
});

marriageRegSchema.post('save', async function (doc, next) {
  if (doc.brideId && doc.groomId) {
    console.log('They are from same family');
    //***CHECK IF THEY ARE SAME FAMILY, IF TRUE DON'T DO ANYTHING

    // Remove bride from bride's family

    const brideFamily = await Parishioners.findById(doc.brideId).select(
      'familyId',
    );
    console.log('Brides family Id : ', brideFamily.familyId);

    const pullBrideId = await Family.findByIdAndUpdate(brideFamily.familyId, {
      $pull: {
        members: {
          _id: brideFamily.familyId,
        },
      },
    });

    // Selecting groom family id
    const groomFamily = await Parishioners.findById(doc.groomId).select(
      'familyId familyName',
    );

    console.log('Groom family Id : ', groomFamily.familyId);

    const updateBride = await Parishioners.findByIdAndUpdate(doc.brideId, {
      familyId: groomFamily.familyId,
      familyName: groomFamily.familyName,
    });

    const addToGroomFamily = await Parishioners.findByIdAndUpdate(
      groomFamily.familyId,
      {
        $push: {
          members: {
            _id: doc.brideId,
          },
        },
      },
    );
  }
  next();
});

marriageRegSchema.post('save', async function (doc, next) {
  let updateList = [];
  if (doc.groomId) updateList.push(doc.groomId);
  if (doc.brideId) updateList.push(doc.brideId);

  if (updateList.length > 0) {
    updateMarriageDate = await Parishioners.updateMany(
      { _id: { $in: updateList } },
      {
        $set: { marriage: doc.marriageDate, maritalStatus: 'married' },
      },
    );
  }
  next();
});

const marriageReg = mongoose.model('marriageReg', marriageRegSchema);

module.exports = marriageReg;
