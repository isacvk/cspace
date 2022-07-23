const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID not specified"],
    unique:true,
  },
  familyId: {
    type: String,
    required: [true, "Family ID is not specified"],
  },
  parishId:{
    type:String,
    required:[true,"Parish Id is not specified"]
  },
  firstName: {
    type: String,
    required: [true, "Please tell us your first name!"],
  },
  lastName: {
    type: String,
    // required: [true, "Please tell us your last name!"],
  },
  dob: {
    type: Date,
    required: [true, "Please tell us your date of birth"],
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
    enum: ["M", "F"],
  },
  wardNo: {
    type: Number,
    required: [true, "Please specify ward number"],
  },
});

const Parishioners = mongoose.model("Parishioners", personSchema);

module.exports = Parishioners;
