const { promisify } = require('util');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Users = require('../model/userModel');
const Parishioners = require('../model/personModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sms = require('./smsController');

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

const generateOtp = async () => {
  let chars = '0123456789';
  let string_length = 4;
  let otp = '';
  for (let i = 0; i < string_length; i++) {
    let rnum = Math.floor(Math.random() * chars.length);
    otp += chars.substring(rnum, rnum + 1);
  }
  return otp;
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
  let string_length = 6;
  let randomId = '';
  for (let i = 0; i < string_length; i++) {
    let rnum = Math.floor(Math.random() * chars.length);
    randomId += chars.substring(rnum, rnum + 1);
  }
  return randomId;
};

exports.signup = catchAsync(async (req, res, next) => {
  if (!req.body.userId) {
    return next(new AppError('Please provide user Id', 400));
  }

  const user = await Parishioners.findById(req.body.userId);

  if (!user) {
    return next(
      new AppError(`No user found with Id ${req.body.userId} !`, 404),
    );
  }

  req.body.familyId = user.familyId;
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
  if (!user.phoneNumber) {
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

exports.toLower = catchAsync(async (req, res, next) => {
  // for (const key in req.body) {
  //   if (typeof req.body[key] === 'object') {
  //     for (const innerKey in req.body[key]) {
  //       if (typeof req.body[key][innerKey] === 'string') {
  //         console.log(req.body[key][innerKey].toLowerCase());
  //       }
  //     }
  //   } else if (typeof req.body[key] === 'string') {
  //     console.log(req.body[key]);
  //   }

  // }
  const mainObjKeys = Object.keys(req.body);

  // mainObjKeys.forEach((key) => {
  //   // console.log(req.body[key]);
  //   if (typeof req.body[key] === 'object') {
  //     const subObjKeys = Object.keys(req.body[key]);
  //     subObjKeys.forEach((subKey)=>{
  //       if (typeof req.body[key][innerKey] === 'string') {
  //           console.log(req.body[key][innerKey].toLowerCase());
  //       }
  //     }
  //   }
  // });

  res.send('ok');
});

exports.login = async (req, res, next) => {
  const { loginId, password } = req.body;

  if (!loginId || !password)
    return next(new AppError('Please provide your loginId and password', 400));

  const user = await Users.findOne({ loginId }).select(
    '+password role isActive',
  );

  console.log('User : ', user);

  if (!user.isActive) {
    return next(
      new AppError(
        'You are not an active user! Contact admin for login access',
        403,
      ),
    );
  }

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect loginId or password', 401));
  }

  createSendToken(user, 200, res);
};

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'logged out', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
    message: 'your are now logged out',
  });
});

exports.forgotPass = catchAsync(async (req, res, next) => {
  if (!req.body.loginId) {
    return next(new AppError('Please provide your loginId', 400));
  }

  const validUser = await Users.findOne({ loginId: req.body.loginId });

  if (!validUser) {
    return next(
      new AppError(`User with the id ${req.body.loginId} doesn't exist!`, 404),
    );
  }

  if (!validUser.isActive) {
    return next(
      new AppError('You are not an active member! Contact admin.', 403),
    );
  }

  let otp = await generateOtp();
  otp = parseInt(otp);

  const setOtp = await Users.findOneAndUpdate(
    { loginId: `${req.body.loginId}` },
    {
      otp: otp,
      otpTime: `${new Date()}`,
    },
  );

  // SMS Content
  if (setOtp) {
    let message = `Your OTP is ${otp} , valid for 5 mins`;
    let phoneNum = [];
    phoneNum[0] = validUser.phoneNumber;

    const sendMessage = await sms.sendSMS(message, phoneNum);
  }

  res.status(200).json({
    status: 'success',
    message: 'An OTP is sent to your number, valid for 5 mins.',
  });
});

exports.verifyOtp = catchAsync(async (req, res, next) => {
  req.body.otp = parseInt(req.body.otp);

  if (isNaN(req.body.otp)) {
    return next(new AppError('Invalid otp!', 400));
  }

  // const otpLength = req.body.otp / 1000;
  // if (otpLength < 1 || otpLength >= 10) {
  //   return next(new AppError('Please enter 4 digit otp', 401));
  // }

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

  if (timeElapsed > 300) {
    return next(new AppError('Your Otp has been expired', 401));
  }

  const updateOtp = await Users.findOneAndUpdate(
    {
      loginId: `${req.body.loginId}`,
      otp: `${req.body.otp}`,
    },
    {
      otp: '1',
    },
  );

  res.status(200).json({
    status: 'success',
    message: 'Otp verified!',
  });
});

exports.resetPass = catchAsync(async (req, res, next) => {
  if (!req.body.password || !req.body.loginId) {
    return next(new AppError('Please provide userId and password', 400));
  }

  if (req.body.password.length < 8) {
    return next(new AppError('Password should be more than 8 characters', 400));
  }

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
  req.user.uid = `${req.user.userId}`.split('"')[0];
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
  if (!req.body.phoneNumber || !req.body.name) {
    return next(
      new AppError('Provie name and phone number of the admin!', 400),
    );
  }

  req.body.loginId = await randomId();

  const newPassword = (await randomPass()).toString();

  req.body.password = await bcrypt.hash(newPassword, 12);

  const updateAdmin = await Users.findOneAndUpdate({ role: 'Admin' }, req.body);

  if (!updateAdmin) {
    return next(
      new AppError('Something went wrong in updating admin data!', 500),
    );
  }

  if (updateAdmin) {
    let message = `You can now login to cspace,
  UID: ${req.body.loginId}
  PSWD: ${newPassword}
    `;
    let phoneNum = [];
    phoneNum[0] = updateAdmin.phoneNumber;

    const sendMessage = await sms.sendSMS(message, phoneNum);
  }

  res.status(201).json({
    status: 'success',
    message: 'admin details updated',
    data: updateAdmin,
  });
});

exports.blockAdmin = catchAsync(async (req, res, next) => {
  const blockAdmin = await Users.findOneAndUpdate(
    { role: 'Admin' },
    { isActive: false },
  );

  res.status(201).json({
    status: 'success',
    message: 'Admin is now blocked',
  });
});
