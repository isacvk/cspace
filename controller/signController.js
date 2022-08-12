const { promisify } = require("util");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const jwt = require("jsonwebtoken");

exports.verifySign = catchAsync(async (req, res, next) => {
  let message;
  //***TODO: This directly sens error for invalid signature with internal server Error.
  const decoded = await promisify(jwt.verify)(
    req.body.sign,
    process.env.JWT_SECRET
  ).catch((e) => {
    message = "Invalid signature!!!";
  });

  res.status(200).json({
    status: "success",
    message,
  });
});
