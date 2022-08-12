const Persons = require("./../model/personModel");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const sms = require("./../controller/smsController");

exports.person = catchAsync(async (req, res, next) => {
  //***TODO: Error when sms is not sent
  const user = await Persons.findById({ _id: req.params.id }).select(
    "phoneNumber"
  );

  if (user) {
    let message = `${req.body.message}
    `;
    let phoneNum = [];
    phoneNum.push(user.phoneNumber);

    const sendMessage = await sms.sendSMS(message, phoneNum);

    if (!sendMessage.return) {
      return next(
        new AppError(`${sendMessage.message}`, sendMessage.status_code)
      );
    }
  }

  res.status(200).json({
    status: "success",
    message: "message sent successfully!",
  });
});

exports.family = catchAsync(async (req, res, next) => {
  const family = await Persons.find({ familyId: req.params.id }).select(
    "phoneNumber"
  );

  if (family) {
    let message = `${req.body.message}
    `;
    let phoneNum = [];
    family.map((e) => {
      phoneNum.push(e.phoneNumber);
    });

    const sendMessage = await sms.sendSMS(message, phoneNum);
    if (!sendMessage.return) {
      return next(
        new AppError(`${sendMessage.message}`, sendMessage.status_code)
      );
    }
  }

  res.status(200).json({
    status: "success",
    message: "message sent successfully!",
  });
});

exports.sendMessage = catchAsync(async (req, res, next) => {
  //***TODO: Handle errors properly
  let queryObj;
  if (req.body.to === "ward") queryObj = { wardNo: req.body.id };
  if (req.body.to === "family") queryObj = { familyId: req.body.id };
  if (req.body.to === "person") queryObj = { _id: req.body.id };
  if (req.body.to === "all") queryObj = {};

  const users = await Persons.find(queryObj).select("phoneNumber");

  if (users) {
    let message = `${req.body.message}
    `;
    let phoneNum = [];
    users.map((e) => {
      phoneNum.push(e.phoneNumber);
    });
    console.log(phoneNum);

    const sendMessage = await sms.sendSMS(message, phoneNum);
    if (!sendMessage.return) {
      return next(
        new AppError(`${sendMessage.message}`, sendMessage.status_code)
      );
    }
  }

  res.status(200).json({
    status: "success",
    message: "message sent successfully!",
  });
});
