const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Parishioners = require('./personModel');

const userSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Parishioners',
    unique: true,
  },
  loginId: {
    type: String,
    required: [true, 'User ID is required!'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please enter the name'],
  },
  familyId: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Family Id is not specified'],
    ref: 'Familiy',
  },
  role: {
    type: String,
    required: [true, 'User role not specified'],
    enum: ['Super-Admin', 'Admin', 'Accountant', 'User'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  phoneNumber: {
    type: Number,
    required: [true, 'Phone number is not specified'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  passwordChangedAt: Date,
  otp: Number,
  otpTime: Date,
});

userSchema.pre('save', async function (next) {
  // console.log(this.password)
  // Runs only when password is modified
  // if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  // console.log(this.password)
  // next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.post('save', async function (doc, next) {
  const personLoginStatus = await Parishioners.findByIdAndUpdate(doc.userId, {
    loginAccess: true,
  });
  next();
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
