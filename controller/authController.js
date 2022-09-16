const { promisify } = require('util');

const Users = require('./../model/userModel');
const Parishioners = require('./../model/personModel');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sms = require('./../controller/smsController');

const createSendToken = (user, statusCode, res) => {
  user.password = undefined;

  const token = signToken(user._id);

  let cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    // sameSite: "strict",
    sameSite: 'strict',
    // secure: true,
    httpOnly: true,
    Path: '/',
  };

  // if (process.env.NODE_ENV === "production") {
  //   cookieOptions.secure = true;
  // }

  // res.cookie("jwt", token, cookieOptions, "Path=/");
  res.cookie('jwt', token, cookieOptions);

  user.__v = undefined;

  res.status(202).json({
    status: 'success',
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
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let string_length = 8;
  let randomPassword = '';
  for (let i = 0; i < string_length; i++) {
    let rnum = Math.floor(Math.random() * chars.length);
    randomPassword += chars.substring(rnum, rnum + 1);
  }
  return randomPassword;
};

const randomId = async () => {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let string_length = 4;
  let randomId = '';
  for (let i = 0; i < string_length; i++) {
    let rnum = Math.floor(Math.random() * chars.length);
    randomId += chars.substring(rnum, rnum + 1);
  }
  return randomId;
};

exports.signup = catchAsync(async (req, res, next) => {
  console.log('SIGN UP CALLED');
  // find the name, create login ID and password and send sms
  // ***?What if user already have uid and pass

  const user = await Parishioners.findById(req.body.userId);
  // TEMP CODE
  let counter = 0;
  const loginId = [
    123458, 123459, 123460, 123461, 123462, 123463, 123464, 123465, 123466,
    123467, 123468, 123469, 123470, 123471, 123472, 123473, 123474, 123475,
  ];

  let repeatIdGenetation = true;
  while (repeatIdGenetation) {
    //! Create dynamic login id
    req.body.loginId = loginId[counter];

    // req.body.loginId = await randomId();
    const idExist = await Users.findOne({ loginId: `${req.body.loginId}` });

    // TEMP CODE
    counter += 1;

    // console.log(idExist);
    if (!idExist) repeatIdGenetation = false;
  }

  // req.body.password = await randomPass();
  if (user.phoneNumber) {
    return next(
      new AppError(
        `Please add phone number of ${user.baptismName} before signup!`,
        403,
      ),
    );
  }
  req.body.password = 'pass1234';
  req.body.name = user.baptismName;
  req.body.phoneNumber = user.phoneNumber;

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

    const sendMessage = await sms.sendSMS(message, phoneNum);
  }

  res.status(201).json({
    status: 'sucess',
  });
});

exports.login = async (req, res, next) => {
  console.log(req.body);
  const { loginId, password } = req.body;

  if (!loginId || !password)
    return next(new AppError('Please provide your loginId and password'));

  const user = await Users.findOne({ loginId }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect loginId or password', 401));
  }

  createSendToken(user, 200, res);
};
//* Sample cookies
//***! Probably should be deleted
exports.loginCookie = catchAsync(async (req, res, next) => {
  let cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    sameSite: 'strict',
    // secure: true,
    httpOnly: true,
    Path: '/',
  };

  res.cookie('jwt', '12345', cookieOptions);
  res.status(202).json({
    status: 'success',
  });
});

exports.forgotPass = catchAsync(async (req, res, next) => {
  const validUser = await Users.findOne({ loginId: `${req.body.loginId}` });

  if (!validUser) {
    return next(
      new AppError(`User with the id ${req.body.loginId} doesn't exist!`, 404),
    );
  }

  const user = await Parishioners.findById(validUser.loginId);

  //***?What is user doesn't have a phone number
  //***TODO: Generate OTP
  let otp = '1232';

  const setOtp = await Users.findOneAndUpdate(
    { loginId: `${req.body.loginId}` },
    {
      otp: `${otp}`,
      otpTime: `${new Date()}`,
    },
  );

  // SMS Content
  if (setOtp) {
    let message = `Your OTP is ${otp} , valid for 15 mins`;
    let phoneNum = [];
    phoneNum[0] = validUser.phoneNumber;

    const sendMessage = await sms.sendSMS(message, phoneNum);
  }

  res.status(200).json({
    status: 'success',
    message: 'An OTP is sent to your number, valid for 15 mins.',
  });
});

exports.verifyOtp = catchAsync(async (req, res, next) => {
  const otpLength = req.body.otp / 1000;
  if (otpLength < 1 || otpLength >= 10) {
    return next(new AppError(`Please enter 4 digit otp`, 401));
  }

  const validOtp = await Users.findOne({
    loginId: `${req.body.loginId}`,
    otp: `${req.body.otp}`,
  });

  if (!validOtp) {
    return next(new AppError('Invalid otp!', 401));
  }
  // Checking if 15 mins has been passed
  const timeElapsed =
    parseInt(new Date() / 1000, 10) - parseInt(validOtp.otpTime / 1000, 10);

  if (timeElapsed > 900) {
    return next(new AppError('Your Otp has been expired', 401));
  }

  const updateOtp = await Users.findOneAndUpdate(
    {
      loginId: `${req.body.loginId}`,
      otp: `${req.body.otp}`,
    },
    {
      otp: `1`,
    },
  );

  res.status(200).json({
    status: 'success',
    message: 'Otp verified!',
  });
});

exports.resetPass = catchAsync(async (req, res, next) => {
  const user = await Users.findOne({ loginId: `${req.body.loginId}` });

  if (!user) {
    return next(
      new AppError(`No user found with id ${req.body.loginId} !`, 404),
    );
  }

  if (user.otp !== 1) {
    return next(new AppError('Your Otp is not verified!', 401));
  }

  const timeElapsed =
    parseInt(new Date() / 1000, 10) - parseInt(user.otpTime / 1000, 10);

  if (timeElapsed > 900) {
    return next(new AppError('Your 15 min has been expired', 401));
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const updatePassword = await Users.findOneAndUpdate(
    { loginId: `${req.body.loginId}` },
    {
      password: `${hashedPassword}`,
      passwordChangedAt: `${new Date()}`,
      otp: `0`,
    },
  );

  res.status(201).json({
    status: 'success',
    message: 'password modified successfully',
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Get Token & check if it exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    // return res.redirect("/login");
    return next(new AppError('You are not logged in', 401));
  }
  // 2. Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user exists
  const currentUser = await Users.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to the token no longer exist.', 401),
    );
  }

  // 4. Check if user changed password after token issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please login again', 401),
    );
  }

  // Grants Access To Protected Route
  req.user = currentUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

exports.adminSignup = catchAsync(async (req, res, next) => {
  console.log('CALEED');
});
