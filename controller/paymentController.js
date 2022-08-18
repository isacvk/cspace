const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const crypto = require("crypto");
const rpay = require("razorpay");
const shortid = require("shortid");

const razorpay = new rpay({
  key_id: `${process.env.RPAY_ID}`,
  key_secret: `${process.env.RPAY_SECRET}`,
});

exports.initiate = catchAsync(async (req, res, next) => {
  const payment_capture = 1;
  const amount = 2;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
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
  const shasum = crypto.createHmac("sha256", `${process.env.RPAY_HASH_SECRET}`);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("CALLBACK : ", req.body.payload.payment.entity);
  } else {
    console.log("Some MF is messing!");
  }

  res.status(200).json({
    status: "ok",
  });
});
