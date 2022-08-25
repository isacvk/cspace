const Offerings = require('../model/offeringsModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createOffering = catchAsync(async (req, res, next) => {
  //   console.log('Req : ', req.body);

  req.createdAt = new Date();
  req.status = 'active';

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
  const offerings = await Offerings.find({ status: 'active' });

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
