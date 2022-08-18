const Parishioners = require("./../model/personModel");
const BaptismReg = require("./../model/baptismRegistry");
const EngagementReg = require("./../model/engagementModel");
const MarriageReg = require("./../model/marriageRegisty");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

const isLegalAge = (dob, gender) => {
  let birthDate = dob;
  let today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if ((gender === "M" && age < 21) || (gender === "F" && age < 18))
    return false;
  else return true;
};

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
  //***? WHAT ABOUT THE MEMBERS WHOSE PARENT DETAILS ARE NOT PRESENT IN DB
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

exports.getEngagementReg = catchAsync(async (req, res, next) => {
  //***CAN SEND GENDER ALSO SO THAT BELOW QUERY DOESN'T NEED TO BE DONE
  const user = await Parishioners.findById(req.params.id).select(
    "gender firstName"
  );

  if (!user)
    return next(new AppError(`No user found with Id ${req.params.id}`, 404));

  let queryObj = {};
  if (user.gender === "M") queryObj = { groomId: req.params.id };
  if (user.gender === "F") queryObj = { brideId: req.params.id };

  //***? WHAT TO DO WHEN MULTIPLE ENTRIES ARE THERE
  const entry = await EngagementReg.find(queryObj);

  if (entry.length === 0)
    return next(new AppError(`No data found for ${user.firstName}!`, 404));

  res.status(201).json({
    status: "success",
    data: entry,
  });
});

exports.addEngagementReg = catchAsync(async (req, res, next) => {
  const user = await Parishioners.findOne({ _id: req.params.id }).select(
    "dob gender"
  );

  if (!user)
    return next(new AppError(`No user found with Id${req.params.id}`, 404));

  if (!isLegalAge(user.dob, user.gender)) {
    return next(
      new AppError(`This person is under aged! Can't add to registry.`, 401)
    );
  }

  let queryObj = {};
  if (user.gender === "M") {
    queryObj = { groomId: req.params.id, status: "valid" };
    req.body.groomId = req.params.id;
  }
  if (user.gender === "F") {
    queryObj = { brideId: req.params.id, status: "valid" };
    req.body.brideId = req.params.id;
  }

  const engagementData = await EngagementReg.find(queryObj);

  if (engagementData.length !== 0) {
    return next(
      new AppError(`valid engagement data already extists for this person`, 403)
    );
  }

  //***TODO: GET DATA OF BRIDE AND GROOM AND ADD BY DEFAULT
  // let groomData, brideData;
  if (!req.body.groomId && !req.body.brideId) {
    return next(new AppError("Please provide either bride Id or groom Id"));
  }

  // if (req.body.brideGroomId) {
  //   groomData = await BaptismReg.findOne({ userId: req.body.brideGroomId });
  //   if (groomData) req.body.brideGroomData.name = groomData.baptismName;
  // }

  const entry = await EngagementReg.create(req.body);

  // console.log("ENGAGE : ", req.body);

  res.status(201).json({
    status: "success",
    message: "Engagement data successfully entered",
    data: entry,
  });
});

exports.updateEngagementReg = catchAsync(async (req, res, next) => {
  const update = await EngagementReg.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!update)
    return next(new AppError(`No entry found with Id ${req.params.id}`, 404));

  res.status(201).json({
    status: "success",
    data: update,
  });
});

exports.getMarriageReg = catchAsync(async (req, res, next) => {
  //***? What if the person marries second time. [Add a field to mark marriage as invalid]

  // const user = await MarriageReg.findById(req.params.id);

  res.status(201).json({
    status: "success",
  });
});

exports.addMarriageReg = catchAsync(async (req, res, next) => {
  //***TODO: Update marriage date in person model as this gets entered
  //***TODO: The details of the bride/groom should automaticlly appear
  //***TODO: SHOULD NOT ADD ENTRY IF DEATH REGISTRY IS PRESENT
  //***? What if the person marries second time. [Add a field to mark marriage as invalid]

  const user = await Parishioners.findOne({ _id: req.params.id }).select(
    "dob gender"
  );

  if (!user)
    return next(new AppError(`No user found with Id${req.params.id}`, 404));

  if (!isLegalAge(user.dob, user.gender)) {
    return next(
      new AppError(`This person is under aged! Can't add to registry.`, 401)
    );
  }

  //***? What about M, F and Others
  let queryObj = {};
  if (user.gender === "M") {
    queryObj = { groomId: `${req.params.id}` };
    req.body.groomId = req.params.id;
  }
  if (user.gender === "f") {
    queryObj = { brideId: `${req.params.id}` };
    req.body.brideId = req.params.id;
  }

  //***TODO: Add isValidMarriage in query later

  const isMarried = await MarriageReg.findOne(queryObj);

  if (isMarried) {
    return next(new AppError("This person is already married!", 200));
  }

  const engagementData = await EngagementReg.findOne(queryObj);

  console.log("ENG DATA : ", engagementData);

  req.body.groomName = engagementData.groomData.name;
  req.body.brideName = engagementData.brideData.name;

  const register = await MarriageReg.create(req.body);

  res.status(201).json({
    status: "success",
  });
});

exports.updateMarriagetReg = catchAsync(async (req, res, next) => {
  const update = await MarriageReg.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!update)
    return next(new AppError(`No entry found with Id ${req.params.id}`, 404));

  res.status(201).json({
    status: "success",
    data: update,
  });
});

exports.addDeathReg = catchAsync(async (req, res, next) => {
  console.log("Death Registry");

  res.status(201).json({
    status: "success",
  });
});
