const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const crypto = require("crypto");

exports.initiate = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
  });
});

exports.callback = catchAsync(async (req, res, next) => {
  const shasum = crypto.createHmac("sha256", `${process.env.RPAY_SECRET}`);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("CALLBACK : ", req.body);
  } else {
    console.log("Some MF is messing!");
  }

  res.status(200).json({
    status: "ok",
  });
});
