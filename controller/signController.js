const jwt = require('jsonwebtoken');

const { promisify } = require('util');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const MarriageReg = require('../model/marriageRegistry');
const BaptismReg = require('../model/baptismRegistry');

exports.verifySign = catchAsync(async (req, res, next) => {
  let flag = 0;
  let message;
  let data;
  let response = {};
  const decoded = await promisify(jwt.verify)(
    req.body.sign,
    process.env.JWT_SECRET,
  ).catch((e) => {
    flag = 1;
    return next(new AppError('Invalid signature!', 401));
  });

  if (decoded.reg === 'baptism') {
    data = await BaptismReg.findOne({ userId: decoded.of });

    if (!data) {
      return next(
        new AppError(
          "Siganture is valid, but this persons baptism registry doesn't exist in the database!",
          404,
        ),
      );
    }
    response.baptismData = data;
    const issueDate = new Date(decoded.iat * 1000).toLocaleString().split(',');
    response.message = `This certificate was issued on ${issueDate[0]} at ${issueDate[1]}. 
    This signature was issued with baptism certificate of ${data.baptismName} ${data.familyName}, 
    here are the details!`;
  }

  if (decoded.reg === 'marriage') {
    data = await MarriageReg.findById(decoded.of);

    if (!data) {
      return next(
        new AppError(
          "Siganture is valid, but this persons baptism registry doesn't exist in the database!",
          404,
        ),
      );
    }

    response.marriageDetails = data;

    const issueDate = new Date(decoded.iat * 1000).toLocaleString().split(',');
    response.message = `This certificate was issued on ${issueDate[0]} at ${issueDate[1]}. 
    This signature was issued with marriage certificate of ${data.groomName} and ${data.brideName}, 
    here are the details!`;

    if (data.status === 'invalid') {
      response.note = 'This marriage is not valid anymore!';
    }
  }

  if (flag !== 1) {
    res.status(200).json({
      status: 'success',
      data: response,
    });
  }
});
