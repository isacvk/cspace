const marriageRegistry = require("./../model/marriageRegisty");
const BaptismReg = require("./../model/baptismRegistry");
const Parishioners = require("./../model/personModel");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

exports.getBaptismReg = catchAsync(async (req, res, next) => {
  const baptismEntry = await BaptismReg.findOne({ userId: req.params.id });

  if (!baptismEntry)
    return next(new AppError(`No entry found with Id ${req.params.id}`, 404));

  res.status(201).json({
    status: "success",
    data: baptismEntry,
  });
});

exports.addBaptismReg = catchAsync(async (req, res, next) => {
  const user = await Parishioners.findById(req.params.id);
  const father = await Parishioners.findById(user.father);
  // const mother = await Parishioners.findById(user.mother);

  // TODO: ADD VALIDATIONS HERE I.E ONLY IF USERS FOUND
  req.body.userId = req.params.id;
  req.body.familyId = user.familyId;
  req.body.father = father.firstName;

  const addEntry = await BaptismReg.create(req.body);

  res.status(201).json({
    status: "success",
  });
});

exports.updateBaptismReg = catchAsync(async (req, res, next) => {
  const baptismEntry = await BaptismReg.findOneAndUpdate(
    { userId: req.params.id },
    req.body
  );

  if (!baptismEntry)
    return next(new AppError(`No entry found with Id ${req.params.id}`, 404));

  res.status(201).json({
    status: "success",
    data: baptismEntry,
  });
});

exports.addEngagementReg = catchAsync(async (req, res, next) => {
  console.log("Engaged");

  res.status(201).json({
    status: "success",
  });
});

exports.addMarriageReg = catchAsync(async (req, res, next) => {
  //***TODO: Check if age above 18 or 21
  //***TODO: Update marriage date in person model as this gets entered
  //***TODO: The details of the bride/groom should automaticlly appear
  //***? What if the person marries second time. [Add a field to mark marriage as invalid]

  const user = await Parishioners.findById(req.params.id);

  //***? What about M, F and Others
  let queryObj = {};
  if (user.gender === "M") {
    queryObj = {
      brideGroomId: `${req.params.id}`,
    };
  } else {
    queryObj = {
      brideId: `${req.params.id}`,
    };
  }

  //***TODO: Add isValidMarriage in query later

  const isMarried = await marriageRegistry.findOne(queryObj);

  if (isMarried) {
    return next(new AppError("This person is already married!", 200));
  }
  const register = await marriageRegistry.create(req.body);

  res.status(201).json({
    status: "success",
  });
});

exports.addDeathReg = catchAsync(async (req, res, next) => {
  console.log("Death Registry");

  res.status(201).json({
    status: "success",
  });
});
