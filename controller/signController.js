const jwt = require('jsonwebtoken');

const { promisify } = require('util');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const MarriageReg = require('../model/marriageRegistry');
const BaptismReg = require('../model/baptismRegistry');

exports.verifySign = catchAsync(async (req, res, next) => {
  let flag = 0;
  let data;
  let response = {};

  const sign = req.body.sign.replace(/\b(. )\b/g, (match) => '.');

  const decoded = await promisify(jwt.verify)(
    sign,
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
    const issueDate = new Date(decoded.iat * 1000).toLocaleString().split(',');
    response.message = `This signature was issued on ${issueDate[0]} at ${
      issueDate[1]
    }. It was issued with baptism certificate of ${data.baptismName} ${
      data.familyName
    }. The baptism was happend on ${
      data.doBaptism.toLocaleString().split(',')[0]
    }. The baptism minister was ${data.minister} and the parish priest was ${
      data.parishPriest
    }.
    `;
  }

  if (decoded.reg === 'marriage') {
    data = await MarriageReg.findById(decoded.of);

    if (!data) {
      return next(
        new AppError(
          "Siganture is valid, but this marriage registry doesn't exist in the database!",
          404,
        ),
      );
    }

    const issueDate = new Date(decoded.iat * 1000).toLocaleString().split(',');
    response.message = `This signature was issued on ${issueDate[0]} at ${
      issueDate[1]
    }. It was issued with marriage certificate of ${data.groomName} and ${
      data.brideName
    }. The marriage was happened on ${
      data.marriageDate.toLocaleString().split(',')[0]
    } and the celebrant was ${data.celebrant}. Priest at the time was ${
      data.parishPriest
    }.`;

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
