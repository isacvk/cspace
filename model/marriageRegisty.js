const mongoose = require("mongoose");

const Parishioners = require("./personModel");
const Family = require("./familyModel");
const EngagementReg = require("./engagementModel");

const marriageRegSchema = new mongoose.Schema({
  groomId: {
    type: mongoose.Schema.ObjectId,
    ref: "Parishioners",
  },
  brideId: {
    type: mongoose.Schema.ObjectId,
    ref: "Parishioners",
  },
  groomName: {
    type: String,
    required: [true, "Groom name is not specified"],
  },
  brideName: {
    type: String,
    required: [true, "Bride name is not specified"],
  },
  marriageDate: {
    type: Date,
    required: [true, "Please provide marriage date"],
  },
  celebrant: {
    type: String,
    required: [true, "Please provide the celebrant name"],
  },
  parishPriest: {
    type: String,
    required: [true, "Parish priest name is not specified"],
  },
  remarks: {
    type: String,
  },
});

//*Updates marriage date on persons model
//***?Why update many is used here

marriageRegSchema.post("save", async function (doc, next) {
  //***WHEN BRIDE IS FROM ANOTHR PARISH
  if (this.groomId && !this.brideId) {
    const familyInfo = await Parishioners.findById(this.groomId).select(
      "familyId wardNo"
    );
    console.log("FAM INFO : ", familyInfo);

    let brideData = await EngagementReg.findOne({
      groomId: this.groomId,
      status: "valid",
    }).select("brideData");

    brideData = brideData.brideData;
    console.log("BRIDE INFO : ", brideData);

    const addToParishioners = await Parishioners.create({
      familyId: familyInfo.familyId,
      wardNo: familyInfo.wardNo,
      firstName: brideData.name,
      dob: brideData.dob,
      baptism: brideData.baptism,
      husband: this.groomId,
      maritalStatus: "Married",
    });
    //TODO: UPDATE REF IN HUSBAND'S DOC

    console.log("PERSONS : ", addToParishioners);

    const updateBrideIdEngReg = await EngagementReg.findOneAndUpdate(
      { groomId: this.groomId },
      { brideId: addToParishioners._id }
    );

    const updateGroomRef = await Parishioners.findByIdAndUpdate(this.groomId, {
      wife: addToParishioners._id,
    });

    console.log("ENG ID : ", updateBrideIdEngReg);

    const updateBrideIdMarReg = await marriageReg.findOneAndUpdate(
      { groomId: this.groomId },
      { brideId: addToParishioners._id }
    );
  }

  next();
});

marriageRegSchema.post("save", async function (doc, next) {
  let updateList = [];
  if (this.groomId) updateList.push(this.groomId);
  if (this.brideId) updateList.push(this.brideId);

  updateMarriageDate = await Parishioners.updateMany(
    { _id: { $in: updateList } },
    {
      $set: { marriage: this.marriageDate, maritalStatus: "Married" },
    }
  );
  next();
});

const marriageReg = mongoose.model("marriageReg", marriageRegSchema);

module.exports = marriageReg;
