const mongoose = require("mongoose");

const baptismSchema = new mongoose.Schema({
  familyId: {
    type: mongoose.Schema.ObjectId,
    ref: "Families",
    required: [true, "Family Id is not specified"],
  },
  familyName: {
    type: String,
    required: [true, "Family name is not specified"],
  },
  baptismName: {
    type: String,
    required: [true, "Baptism name is not specified"],
  },
  father: {
    type: String,
  },
  mother: {
    type: String,
  },
  dob: {
    type: Date,
    required: [true, "DOB is not specified"],
  },
  doBaptism: {
    type: Date,
    required: [true, "Date of baptism is not specified"],
  },
  place: {
    type: String,
    required: [true, "Place of bith is not specified"],
  },
  godFather: {
    name: {
      type: String,
      required: [true, "God father name is not specified"],
    },
    parish: {
      type: String,
      required: [true, "Parish of the god father is not specified"],
    },
  },
  godMother: {
    name: {
      type: String,
      required: [true, "God mother name is not specified"],
    },
    parish: {
      type: String,
      required: [true, "Parish of the god father is not specified"],
    },
  },
  minister: {
    type: String,
    required: [true, "Minister name is not specified"],
  },
  parishPriest: {
    type: String,
    // required:[true,"Parish priest name is not specified"]
  },
  remarks: {
    type: String,
  },
});

const BaptismReg = mongoose.model("Announce", baptismSchema);

module.exports = BaptismReg;
