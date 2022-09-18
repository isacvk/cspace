const { promisify } = require('util');

const crypto = require('crypto');
const Rpay = require('razorpay');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Users = require('../model/userModel');
const Parishioners = require('../model/personModel');
const Offerings = require('../model/offeringsModel');
const Sponsors = require('../model/sponsorsModel');

const razorpay = new Rpay({
  key_id: `${process.env.RPAY_ID}`,
  key_secret: `${process.env.RPAY_SECRET}`,
});

const getUserId = async (req, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  console.log('TOKEN : ', token);
  console.log('COOKIE : ', req.cookies.jwt);
  if (!token) {
    // return res.redirect("/login");
    return next(new AppError('You are not logged in', 401));
  }
  // 2. Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await Users.findById(decoded.id).select('userId');
  return user.userId;
};

exports.initiate = catchAsync(async (req, res, next) => {
  const offering = await Offerings.findById(req.params.id);

  if (!offering) {
    return next(
      new AppError(`No offering found with Id ${req.params.id}!`, 404),
    );
  }

  let userId;
  if (req.body.self) {
    userId = await getUserId(req, next);
  }
  console.log('UID : ', userId);
  const payment_capture = 1;
  const { amount } = offering;
  const currency = 'INR';

  const options = {
    amount: amount * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    let sponsorData = {
      baptismName: req.body.baptismName,
      phoneNum: req.body.phoneNum,
      description: req.body.description,
      offeringId: offering._id,
      orderId: response.id,
      createdAt: new Date(),
    };
    if (userId) sponsorData.userId = userId;
    const createSponsor = await Sponsors.create(sponsorData);
    if (!createSponsor) {
      return next(new AppError('Something went wrong, Try again!', 500));
    }
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
  // res.status(200).json({
  //   status: "success",
  // });
});

exports.callback = catchAsync(async (req, res, next) => {
  const shasum = crypto.createHmac('sha256', `${process.env.RPAY_HASH_SECRET}`);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest === req.headers['x-razorpay-signature']) {
    const callBack = req.body.payload.payment.entity;
    console.log('CALLBACK : ', req.body.payload.payment.entity);

    if (callBack.status !== 'captured') {
      // TODO: DELETE ENTRY FROM SPONSORS
      const deleteSponsor = await Sponsors.findOneAndDelete({
        orderId: callBack.order_id,
      });
      return next(
        new AppError(
          'Something went wrong with your payment! Order not confirmed.',
          404,
        ),
      );
    }

    const updatePaymentStatus = await Sponsors.findOneAndUpdate(
      { orderId: callBack.order_id },
      {
        status: 'paid',
        paidAt: new Date(),
      },
    );
    // TODO: SEND CONFIRMATION MESSAGE
  } else {
    console.log('Some MF is messing!');
  }

  res.status(200).json({
    status: 'ok',
  });
});
