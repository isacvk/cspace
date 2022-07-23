const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID is required!"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please enter the name"],
  },
  role: {
    type: String,
    required: [true, "User role not specified"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  parish: {
    type: String,
    required: [true, "Please specify parish"],
  },
});
