const Persons = require('../model/personModel');
const Family = require('../model/familyModel');
const Birthdays = require('../model/birthdayModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.newPerson = catchAsync(async (req, res, next) => {
  const addPerson = await Persons.create(req.body);

  res.status(201).json({
    status: 'success',
    data: addPerson,
  });
});

const addMember = catchAsync(async (details) => {
  const addPerson = await Persons.create(details).catch((e) => {
    console.log('ERR : ', e);
  });
});

exports.newPerson2 = catchAsync(async (req, res, next) => {
  // const addPerson = await Persons.create(req.body);

  // TODO: ADD FAMILY NAME IN PARISHIONERS MODEL
  const family = await Family.findById(req.body.familyId);

  if (!family) {
    return next(
      new AppError(`No family found with Id ${req.body.familyId}`, 404),
    );
  }

  const familyMembers = req.body.persons;
  familyMembers.map((person) => {
    person.familyId = `${req.body.familyId}`;
    person.wardNo = `${req.body.wardNo}`;
    person.familyName = family.familyName;
    addMember(person);
  });

  res.status(201).json({
    status: 'success',
    message: 'members added successfully',
  });
});

exports.getPersons = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };

  console.log('REQ QUERY : ', queryObj);
  const excludedFields = ['sort'];
  excludedFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Persons.find(JSON.parse(queryStr));

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('baptismName');
  }

  const persons = await query;

  res.status(200).json({
    status: 'success',
    results: persons.length,
    persons,
  });
});

exports.getPerson = catchAsync(async (req, res, next) => {
  const person = await Persons.findOne({ _id: req.params.id });

  if (!person)
    return next(new AppError(`No person found with id ${req.params.id}!`, 404));

  person.relations = person.__v = undefined;

  res.status(200).json({
    status: 'success',
    person,
  });
});

exports.getPersonRelations = catchAsync(async (req, res, next) => {
  const person = await Persons.findOne({ _id: req.params.id }).populate(
    'father brothers',
  );

  if (!person)
    return next(new AppError(`No person found with id ${req.params.id}!`, 404));

  res.status(200).json({
    status: 'success',
    person,
  });
});

exports.addRelations = catchAsync(async (req, res, next) => {
  const user = await Persons.findByIdAndUpdate(req.params.id, req.body);
  // console.log(user);

  res.status(200).json({
    status: 'success',
    message: 'relations successfully added',
  });
});

exports.updateRelations = catchAsync(async (req, res, next) => {
  //***TODO: Handle errors
  const user = await Persons.findByIdAndUpdate(req.params.id, {
    $push: {
      brothers: {
        _id: req.body.brother,
      },
    },
  });

  res.status(201).json({
    status: 'success',
    message: 'new relation added',
  });
});

exports.getBdayList = catchAsync(async (req, res, next) => {
  const birthdays = await Birthdays.find();

  res.status(200).json({
    status: 'success',
    data: birthdays,
  });
});
