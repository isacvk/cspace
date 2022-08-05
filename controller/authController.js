const { promisify } = require("util");

const Users = require("./../model/userModel");
const Parishioners = require("./../model/personModel");

const jwt = require("jsonwebtoken");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sms = require("./../controller/smsController");

const createSendToken = (user, statusCode, res) => {
  user.password = undefined;

  const token = signToken(user._id);

  let cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    sameSite: "strict",
    httpOnly: true,
    Path: "/",
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions, "Path=/");

  user.__v = undefined;

  res.status(statusCode).json({
    status: "success",
    data: {
      user: user,
    },
  });
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const randomPass = async () => {
  let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let string_length = 8;
  let randomPassword = "";
  for (let i = 0; i < string_length; i++) {
    let rnum = Math.floor(Math.random() * chars.length);
    randomPassword += chars.substring(rnum, rnum + 1);
  }
  return randomPassword;
};

const randomId = async () => {
  let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let string_length = 4;
  let randomId = "";
  for (let i = 0; i < string_length; i++) {
    let rnum = Math.floor(Math.random() * chars.length);
    randomId += chars.substring(rnum, rnum + 1);
  }
  return randomId;
};

exports.signup = catchAsync(async (req, res, next) => {
  // find the name, create login ID and password and send sms

  const user = await Parishioners.findById(req.body.userId);

  let repeatIdGenetation = true;
  while (repeatIdGenetation) {
    req.body.loginId = "123458";
    // req.body.loginId = await randomId();
    const idExist = await Users.findOne({ loginId: `${req.body.loginId}` });

    // console.log(idExist);
    if (!idExist) repeatIdGenetation = false;
  }

  // req.body.password = await randomPass();
  req.body.password = "pass1234";
  req.body.name = user.firstName;

  const newUser = await Users.create(req.body);

  // console.log(newUser);
  // SMS CONTENT
  if (newUser) {
    let message = `You can now login to cspace,
  UID: ${req.body.loginId}
  PSWD: ${req.body.password}
    `;
    let phoneNum = [];
    phoneNum[0] = user.phoneNumber;

    // const sendMessage = await sms.sendSMS(message, phoneNum);
  }

  res.status(201).json({
    status: "sucess",
  });
});

exports.login = async (req, res, next) => {
  const { loginId, password } = req.body;

  if (!loginId || !password)
    return next(new AppError("Please provide your userId and password"));

  const user = await Users.findOne({ loginId }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect userId or password", 401));
  }

  createSendToken(user, 200, res);
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Get Token & check if it exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    // return res.redirect("/login");
    return next(new AppError("You are not logged in", 401));
  }
  // 2. Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user exists
  const currentUser = await Users.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError("The user belonging to the token no longer exist.", 401)
    );
  }

  // 4. Check if user changed password after token issued
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError("User recently changed password! Please login again", 401)
  //   );
  // }

  // Grants Access To Protected Route
  req.user = currentUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
