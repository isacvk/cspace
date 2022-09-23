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
  console.log('PRE SAVE : ', this);
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

marriageRegSchema.post('save', async (doc, next) => {
  //* WHEN GROOM IS FROM ANOTHR PARISH
  if (!doc.groomId && doc.brideId) {
    console.log('DOC.BRIDE ID : ', doc);
    const updateIsActive = await Parishioners.findByIdAndUpdate(doc.brideId, {
      isActive: false,
      marriage: doc.marriageDate,
    });
    next();
  }
});

marriageRegSchema.post('save', async (doc, next) => {
  if (doc.brideId && doc.groomId) {
    console.log('They are from same parish');

    const brideData = await Parishioners.findById(doc.brideId);

    const brideFamily = await Family.findById(brideData.familyId);

    const pullBrideId = await Family.findOneAndUpdate(
      { _id: brideFamily._id },
      {
        $pullAll: {
          members: [brideData._id],
        },
      },
      { new: true },
      // function (error, success) {
      //   if (error) {
      //     console.log('ERR IN PULLING');
      //   } else {
      //     console.log('PULLING SUCCESS');
      //   }
      // },
    );

    console.log('PULLED : ', pullBrideId);

    // Selecting groom family id
    const groomData = await Parishioners.findById(doc.groomId);

    const groomFamily = await Family.findById(groomData.familyId);

    console.log('GROOM FAM : ', groomFamily);

    const updateBride = await Parishioners.findByIdAndUpdate(
      doc.brideId,
      {
        familyId: groomFamily._id,
        familyName: groomFamily.familyName,
        husband: doc.groomId,
      },
      { new: true },
    );

    console.log('BRIDE UPD : ', updateBride);

    const updateGroom = await Parishioners.findByIdAndUpdate(
      doc.groomId,
      {
        wife: doc.brideId,
      },
      { new: true },
    );
    console.log('GROOM UPD : ', updateGroom);

    const addToGroomFamily = await Family.findOneAndUpdate(
      {
        _id: groomFamily._id,
      },
      {
        $push: {
          members: {
            _id: doc.brideId,
          },
        },
      },
      { new: true },
    );

    // const addToGroomFamily = await Family.findOneAndUpdate(
    //   {
    //     _id: groomFamily._id,
    //   },
    //   {
    //     $push: {
    //       members: [brideData._id],
    //     },
    //   },
    //   { new: true, upsert: true },
    //   // function (error, success) {
    //   //   if (error) {
    //   //     console.log('ERR IN PUSHING : ', error);
    //   //   } else {
    //   //     console.log('PUSHING SUCCESS : ', success);
    //   //   }
    //   // },
    // );

    console.log('PUSHED : ', addToGroomFamily);
  }
  next();
});

marriageRegSchema.post('save', async (doc, next) => {
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
