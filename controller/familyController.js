const Family = require('./../model/familyModel');

const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.addFamily = catchAsync(async (req, res, next) => {
  const addFamily = await Family.create(req.body);

  res.status(201).json({
    status: 'success',
    data: addFamily,
  });
});

exports.getFamilies = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ['sort'];
  excludedFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Family.find(JSON.parse(queryStr));

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('familyName');
  }

  const getFamilies = await query;

  res.status(201).json({
    status: 'success',
    results: getFamilies.length,
    data: getFamilies,
  });
});

exports.getFamily = catchAsync(async (req, res, next) => {
  const getFamily = await Family.findById(req.params.id).populate('members');

  if (!getFamily)
    return next(
      new AppError(`No family found with the id ${req.params.id}!`, 404),
    );

  res.status(200).json({
    status: 'success',
    data: getFamily,
  });
});

exports.updateFamily = catchAsync(async (req, res, next) => {
  const updateFamily = await Family.findOneAndUpdate(
    {
      _id: `${req.params.id}`,
    },
    req.body,
  );

  if (!updateFamily) {
    return next(new AppError(`No family found with that Id!`, 404));
  }

  res.status(201).json({
    status: 'success',
    message: 'Family info succesfully modified',
    family: updateFamily,
  });
});
