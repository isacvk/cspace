const mongoose = require("mongoose");

const Parishioners = require("./personModel");

const marriageRegSchema = new mongoose.Schema({
  brideGroomId: {
    type: mongoose.Schema.ObjectId,
    ref: "Parishioners",
  },
  brideId: {
    type: mongoose.Schema.ObjectId,
    ref: "Parishioners",
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

marriageRegSchema.post("save", async function (next) {
  let updateList = [];
  if (this.brideGroomId) updateList.push(this.brideGroomId);
  if (this.brideId) updateList.push(this.brideId);

  updateMarriageDate = await Parishioners.updateMany(
    { _id: { $in: updateList } },
    {
      $set: { marriage: this.marriageDate, maritalStatus: "Married" },
    }
  );
});

const marriageReg = mongoose.model("marriageReg", marriageRegSchema);

module.exports = marriageReg;
