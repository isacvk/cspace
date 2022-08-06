const Family = require("./../model/familyModel");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

exports.addFamily = catchAsync(async (req, res, next) => {
  const addFamily = await Family.create(req.body);

  res.status(201).json({
    status: "success",
    data: addFamily,
  });
});

exports.getFamilies = catchAsync(async (req, res, next) => {
  getFamily = await Family.find().sort({ familyName: 1 });

  res.status(201).json({
    status: "success",
    data: getFamily,
  });
});

exports.getFamily = catchAsync(async (req, res, next) => {
  const getFamily = await Family.findById(req.params.id).populate("members");

  if (!getFamily)
    return next(
      new AppError(`No family found with the id ${req.params.id}!`, 404)
    );

  res.status(200).json({
    status: "success",
    data: getFamily,
  });
});

exports.updateFamily = catchAsync(async (req, res, next) => {
  const updateFamily = await Family.findOneAndUpdate(
    {
      _id: `${req.params.id}`,
    },
    req.body
  );

  if (!updateFamily) {
    return next(new AppError(`No family found with that Id!`, 404));
  }

  res.status(201).json({
    status: "success",
    message: "Family info succesfully modified",
    family: updateFamily,
  });
});
