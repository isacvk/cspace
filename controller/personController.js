const Persons = require('../model/personModel');
const Family = require('../model/familyModel');
const Birthdays = require('../model/birthdayModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.newMember = catchAsync(async (req, res, next) => {
  const family = await Family.findById(req.body.familyId);

  if (!family) {
    return next(
      new AppError(`No family found with Id ${req.body.familyId}`, 404),
    );
  }

  req.body.familyId = family.id;
  req.body.wardNo = family.wardNum;
  req.body.familyName = family.familyName;

  const addPerson = await Persons.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'member added successfully',
    data: addPerson,
  });
});

exports.newPerson = catchAsync(async (req, res, next) => {
  // TODO: ADD FAMILY NAME IN PARISHIONERS MODEL
  const family = await Family.findById(req.body.familyId);

  if (!family) {
    return next(
      new AppError(`No family found with Id ${req.body.familyId}`, 404),
    );
  }

  const familyMembers = req.body.persons;
  let personDetails;
  let flag;
  familyMembers.map(async (person) => {
    personDetails = { ...person };
    personDetails.familyId = family.id;
    personDetails.wardNo = family.wardNum;
    personDetails.familyName = family.familyName;

    const addPerson = await Persons.create(personDetails);

    flag = !addPerson ? 1 : 0;

    // if(!addPerson){
    //   return next(new AppError(`The person ${person.baptismName} was not created!`,))
    // }
    // console.log(personDetails);
  });

  if (flag === 1) {
    return next(new AppError('There was an error in adding members!', 500));
  }

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
  if (!req.params.id || req.params.id === null) {
    return next(new AppError('Please provide person id!', 400));
  }

  console.log(req.user.uid, req.params.id);

  const isSameUser = req.user.uid === req.params.id;

  if (req.user.role === 'User' && !isSameUser) {
    return next(
      new AppError("You don't have permission to access this document!", 403),
    );
  }

  const person = await Persons.findOne({ _id: req.params.id }).lean();

  if (!person) {
    return next(new AppError(`No person found with id ${req.params.id}!`, 404));
  }

  person.relations = person.__v = undefined;

  if (
    (req.user.role === 'User' && person.privacyEnabled) ||
    (req.user.role === 'Accountant' && person.privacyEnabled)
  ) {
    if (!isSameUser) {
      for (const key in person) {
        if (key === 'baptismName' || key === '_id' || key === 'familyId') {
          continue;
        }
        person[key] = 'N/A';
      }
    }
  }

  res.status(200).json({
    status: 'success',
    person,
  });
});

exports.getPersonRelations = catchAsync(async (req, res, next) => {
  console.log('REQ QEURY : ', req.query);
  const query = { ...req.query };

  const populateFields = `${query.father ? 'father' : ''} ${
    query.mother ? 'mother' : ''
  } ${query.husband ? 'husband' : ''} ${query.wife ? 'wife' : ''} ${
    query.sons ? 'sons' : ''
  } ${query.daughters ? 'daughter' : ''} ${query.brothers ? 'brothers' : ''} ${
    query.sisters ? 'sisters' : ''
  }`;

  const person = await Persons.findOne({ _id: req.params.id }).populate(
    // 'father mother brothers sisters husband wife',
    // `${query.father ? query.father : ''} ${query.mother ? query.mother : ''}`,
    [{ path: `${populateFields}`, strictPopulate: false }],
  );

  if (!person) {
    return next(new AppError(`No person found with id ${req.params.id}!`, 404));
  }

  res.status(200).json({
    status: 'success',
    person,
  });
});

exports.addRelations = catchAsync(async (req, res, next) => {
  if (req.body.husband || req.body.wife) {
    req.body.maritalStatus = 'Reg-To-Be-Added';
  }
  const user = await Persons.findByIdAndUpdate(req.params.id, req.body);

  if (!user) {
    return next(new AppError(`No user found with id ${req.params.id}`));
  }
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

exports.proposeChange = catchAsync(async (req, res, next) => {
  const setProposal = await Persons.findByIdAndUpdate(req.body.changeId, {
    changeProposed: true,
  });

  if (!setProposal) {
    return next(
      new AppError(`No user found with Id ${req.body.changeId}`, 404),
    );
  }

  const createProposal = await Persons.create(req.body);

  res.status(200).json({
    status: 'success',
    message: 'change request has been made. Wait till approval!',
  });
});
