const pdf = require('html-pdf');
const jwt = require('jsonwebtoken');

const Persons = require('../model/personModel');
const EngagementReg = require('../model/engagementModel');
const MarriageReg = require('../model/marriageRegistry');
const BaptismReg = require('../model/baptismRegistry');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const template = require('../templates/generalInfo');

exports.personPdf = catchAsync(async (req, res, next) => {
  const data = await Persons.findById(req.params.id);

  if (!data) {
    return next(new AppError(`No user found with ID ${req.params.id}`, 404));
  }

  pdf
    .create(template.generalInfo(data), {})
    .toFile('./public/general-info.pdf', (err) => {
      if (err) {
        return Promise.reject();
      }
      return Promise.resolve();
    });
  res.status(200).json({
    status: 'success',
    message: 'PDF created. You can download now!',
    link: '/general-info.pdf',
  });
});

const signToken = (credentials) =>
  jwt.sign(credentials, process.env.JWT_SECRET);

exports.marriagePdf = catchAsync(async (req, res, next) => {
  let data = await marriageRegistry.findById(req.params.id);

  if (!data)
    return next(new AppError(`No user found with ID ${req.params.id}`, 404));

  const pdfConfig = {
    format: 'A4',
    orientation: 'portrait',
    border: {
      top: '2cm',
      right: '1cm',
      bottom: '2cm',
      left: '1.5cm',
    },
  };

  const credentials = {
    to: data._id,
    for: 'marriage',
  };

  data.signature = signToken(credentials);

  console.log('SIGN : ', data.signature);

  pdf
    .create(template.marriageInfo(data), pdfConfig)
    .toFile('./public/marriage-info.pdf', (err) => {
      if (err) {
        return Promise.reject();
      }
      return Promise.resolve();
    });

  res.status(200).json({
    status: 'success',
    message: 'PDF created. You can download now!',
    link: '/general-info.pdf',
  });
});

exports.baptismPdfInfo = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError('Please provide the userId!', 400));
  }
  const baptismData = await BaptismReg.findOne({
    userId: req.params.id,
  }).lean();

  if (!baptismData) {
    return next(
      new AppError(`No entry found with userId ${req.params.id}!`, 404),
    );
  }

  const credentials = {
    of: baptismData.userId,
    reg: 'baptism',
  };

  baptismData.signature = signToken(credentials);

  res.status(200).json({
    status: 'success',
    message: 'baptism registry informations',
    data: baptismData,
  });
});

exports.marriagePdfInfo = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError('Please provide the document Id!', 400));
  }
  const marriageData = await MarriageReg.findById(req.params.id).lean();

  if (!marriageData) {
    return next(
      new AppError(`No entry found with document Id ${req.params.id}!`, 404),
    );
  }

  let engData;
  if (marriageData.brideId) {
    engData = await EngagementReg.findOne({
      brideId: marriageData.brideId,
    }).lean();
  } else {
    engData = await EngagementReg.findOne({
      groomId: marriageData.groomId,
    }).lean();
  }

  marriageData['groomData'] = engData.groomData;
  marriageData['brideData'] = engData.brideData;

  const credentials = {
    of: marriageData._id,
    reg: 'marriage',
  };

  marriageData.signature = signToken(credentials);

  res.status(200).json({
    status: 'success',
    message: 'marriage registry informations',
    data: marriageData,
  });
});
