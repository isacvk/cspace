const Persons = require("./../model/personModel");

const AppError = require("./../utils/appError")
const catchAsync = require("./../utils/catchAsync")

exports.newPerson = catchAsync(async (req, res, next) => {

  const addPerson = await Persons.create(req.body);

  res.status(201).json({
    status: "success",
    data:addPerson
  });
})

exports.getPerson = catchAsync(async (req, res, next) => {
  if (req.body.person==='all') person = await Persons.find();
  else
  person = await Persons.findOne({
    userId: req.body.person,
  });

  res.status(201).json({
    status: "success",
    person,
  });
})
