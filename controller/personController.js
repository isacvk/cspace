const Persons = require("./../model/personModel");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

exports.newPerson = catchAsync(async (req, res, next) => {
  const addPerson = await Persons.create(req.body);

  res.status(201).json({
    status: "success",
    data: addPerson,
  });
});

exports.getPersons = catchAsync(async (req, res, next) => {
  if (req.body.person === "all") person = await Persons.find();
  else
    person = await Persons.findOne({
      userId: req.body.person,
    });

  res.status(201).json({
    status: "success",
    person,
  });
});

exports.getPerson = catchAsync(async (req, res, next) => {
  const person = await Persons.findOne({ userId: req.params.id });

  if (!person)
    return next(new AppError(`No person found with id ${req.params.id}!`, 404));

  res.status(201).json({
    status: "success",
    person,
  });
});
