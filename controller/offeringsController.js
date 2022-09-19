const fs = require('fs');

const json2csv = require('json2csv').parse;
const fields = ['baptismName', 'phoneNum', 'description', 'paidAt'];

const Offerings = require('../model/offeringsModel');
const Sponsors = require('../model/sponsorsModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createOffering = catchAsync(async (req, res, next) => {
  //   console.log('Req : ', req.body);

  req.body.createdAt = new Date();

  const createOffering = await Offerings.create(req.body);

  if (!createOffering) {
    return next(
      new AppError('Something went wrong when creating offering!', 500),
    );
  }
  res.status(201).json({
    status: 'success',
    message: 'Offering successfully created!',
  });
});

exports.getOfferings = catchAsync(async (req, res, next) => {
  const offerings = await Offerings.find({ isActive: true });

  if (offerings.length === 0) {
    return next(new AppError('No offerings available at the moment!', 200));
  }
  res.status(200).json({
    status: 'success',
    data: offerings,
  });
});

exports.getOffering = catchAsync(async (req, res, next) => {
  // TODO: ADD A LIST OF ALL SPONSORS IN THE RESULT
  const offering = await Offerings.findById(req.params.id);

  if (!offering) {
    return next(
      new AppError(`No offering found with Id ${req.params.id}!`, 404),
    );
  }
  res.status(200).json({
    status: 'success',
    data: offering,
  });
});

exports.getSponsors = catchAsync(async (req, res, next) => {
  const sponsors = await Sponsors.find({
    offeringId: req.params.id,
    status: 'paid',
  });

  res.status(200).json({
    status: 'success',
    data: sponsors,
  });
});

exports.generateCsv = catchAsync(async (req, res, next) => {
  const sponsors = await Sponsors.find({ offeringId: req.params.id });

  if (sponsors.length === 0) {
    return next(
      new AppError(`No data found with offer id ${req.params.id}`, 404),
    );
  }

  const csv = json2csv(sponsors, { fields });

  fs.writeFile('./public/sponsors.csv', `${csv}`, (err) => {
    if (err) throw err;
  });
  res.status(200).json({
    status: 'success',
    message: 'CSV file generated!',
    link: '/sponsors.csv',
  });
});
