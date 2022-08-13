const mongoose = require("mongoose");

const deathRegSchema = new mongoose.Schema({
  personId: {
    type: mongoose.Schema.ObjectId,
    ref: "Parishioners",
  },
  name: {
    type: String,
    required: [true, "Please specify the name"],
  },
  dob: {
    type: Date,
  },
  age: {
    type: Number,
    required: [true, "Please specify the age"],
  },
  //   father:{
  //     type:String
  //   },
  sickness: {
    type: String,
  },
  sacraments: {
    confession: {
      type: Boolean,
      required: [true, "Please specify whether or not confessed"],
    },
    viaticum: {
      type: Boolean,
      required: [true, "Please specify viaticum"],
    },
    anointing: {
      type: Boolean,
      requied: [true, "Please specify anointing"],
    },
    dod: {
      type: Date,
      required: [true, "Please specify the date of death"],
    },
    doburial: {
      type: Date,
      required: [true, "Please specify the date of burial"],
    },
    parishPriest: {
      type: String,
    },
    remarks: {
      type: String,
    },
  },
});

const DeathReg = mongoose.model("DeathReg", deathRegSchema);

module.exports = DeathReg;
