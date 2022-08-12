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

const addMember = catchAsync(async (details) => {
  const addPerson = await Persons.create(details).catch((e) => {});
});

exports.newPerson2 = catchAsync(async (req, res, next) => {
  // const addPerson = await Persons.create(req.body);

  const familyMembers = req.body.persons;
  familyMembers.map((person) => {
    person.familyId = `${req.body.familyId}`;
    person.wardNo = `${req.body.wardNo}`;
    addMember(person);
  });

  res.status(201).json({
    status: "success",
    // data: addPerson,
  });
});

exports.getPersons = catchAsync(async (req, res, next) => {
  const person = await Persons.find();

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
