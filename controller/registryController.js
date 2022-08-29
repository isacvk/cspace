const Parishioners = require('./../model/personModel');
const BaptismReg = require('./../model/baptismRegistry');
const EngagementReg = require('./../model/engagementModel');
const MarriageReg = require('./../model/marriageRegistry');
const DeathReg = require('./../model/deathRegistry');

const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const calcAge = (dob) => {
  let birthDate = dob;
  let today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const calcDeathAge = (dob, dod) => {
  let birthDate = dob;
  let deathDate = dod;
  let age = deathDate.getFullYear() - birthDate.getFullYear();
  let m = deathDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && deathDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const isLegalAge = (dob, gender) => {
  const age = calcAge(dob);
  if ((gender === 'M' && age < 21) || (gender === 'F' && age < 18))
    return false;
  else return true;
};

exports.getBaptismReg = catchAsync(async (req, res, next) => {
  const baptismEntry = await BaptismReg.findOne({ userId: req.params.id });

  if (!baptismEntry)
    return next(new AppError(`No entry found with Id ${req.params.id}`, 404));

  res.status(201).json({
    status: 'success',
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
  req.body.father = father.baptismName;

  const addEntry = await BaptismReg.create(req.body);

  res.status(201).json({
    status: 'success',
  });
});

exports.updateBaptismReg = catchAsync(async (req, res, next) => {
  const baptismEntry = await BaptismReg.findOneAndUpdate(
    { userId: req.params.id },
    req.body,
  );

  if (!baptismEntry)
    return next(new AppError(`No entry found with Id ${req.params.id}`, 404));

  res.status(201).json({
    status: 'success',
    data: baptismEntry,
  });
});

exports.getEngagementReg = catchAsync(async (req, res, next) => {
  //***CAN SEND GENDER ALSO SO THAT BELOW QUERY DOESN'T NEED TO BE DONE
  const user = await Parishioners.findById(req.params.id).select(
    'gender baptismName',
  );

  if (!user)
    return next(new AppError(`No user found with Id ${req.params.id}`, 404));

  let queryObj = {};
  if (user.gender === 'M') queryObj = { groomId: req.params.id };
  if (user.gender === 'F') queryObj = { brideId: req.params.id };

  //***? WHAT TO DO WHEN MULTIPLE ENTRIES ARE THERE
  const entry = await EngagementReg.find(queryObj);

  if (entry.length === 0)
    return next(new AppError(`No data found for ${user.baptismName}!`, 404));

  res.status(201).json({
    status: 'success',
    data: entry,
  });
});

exports.addEngagementReg = catchAsync(async (req, res, next) => {
  const user = await Parishioners.findOne({ _id: req.params.id }).select(
    'dob gender',
  );

  if (!user)
    return next(new AppError(`No user found with Id${req.params.id}`, 404));

  if (!isLegalAge(user.dob, user.gender)) {
    return next(
      new AppError(
        `The person with Id ${req.params.id} is under aged! Can't add to registry.`,
        403,
      ),
    );
  }

  let partner;
  if (req.body.partnerId) {
    partner = await Parishioners.findById(req.body.partnerId).select(
      'dob gender',
    );

    if (!partner)
      return next(
        new AppError(`No user found with Id ${req.body.partnerId}`, 404),
      );

    if (
      (user.gender === 'M' && partner.gender === 'M') ||
      (user.gender === 'F' && partner.gender === 'F')
    )
      return next(new AppError(`Same sex marriage is not allowed!`, 403));

    if (!isLegalAge(partner.dob, partner.gender)) {
      return next(
        new AppError(
          `The person with Id ${req.body.partnerId} is under aged! Can't add to registry.`,
          403,
        ),
      );
    }
  }

  let queryObj = {};
  let queryObj2 = {}; //USE THIS
  if (user.gender === 'M') {
    queryObj = { groomId: req.params.id, status: 'valid' };
    req.body.groomId = req.params.id;
    if (req.body.partnerId) {
      req.body.brideId = req.body.partnerId;
      queryObj2 = { brideId: req.body.partnerId, status: 'valid' };
    }
  }

  if (user.gender === 'F') {
    queryObj = { brideId: req.params.id, status: 'valid' };
    req.body.brideId = req.params.id;
    if (req.body.partnerId) {
      req.body.groomId = req.body.partnerId;
      queryObj2 = { groomId: req.body.partnerId, status: 'valid' };
    }
  }

  //***?WTF IS THIS??? QUERYING FROM SAME MODEL?
  const engagementData = await EngagementReg.find(queryObj);
  const engagementData2 = await EngagementReg.find(queryObj2);
  const marriageData = await EngagementReg.find(queryObj);
  const marriageData2 = await EngagementReg.find(queryObj2);

  if (engagementData.length !== 0 || engagementData2.length !== 0) {
    return next(new AppError(`valid engagement data already extists!`, 403));
  }

  if (marriageData.length !== 0 || marriageData2.length !== 0) {
    return next(new AppError(`valid marriage data already extists!`, 403));
  }
  //***TODO: CHECK IF BRIDE OR GROOM HAS VALID MARRIAGE REGISTRY
  //***TODO: GET DATA OF BRIDE AND GROOM AND ADD BY DEFAULT - NOT POSSIBLE AS SOME PEOPLE MAY NOT HAVE THAT.
  // let groomData, brideData;
  // if (!req.body.groomId && !req.body.brideId) {
  //   return next(new AppError("Please provide either bride Id or groom Id"));
  // }

  // if (req.body.brideGroomId) {
  //   groomData = await BaptismReg.findOne({ userId: req.body.brideGroomId });
  //   if (groomData) req.body.brideGroomData.name = groomData.baptismName;
  // }

  const entry = await EngagementReg.create(req.body);

  // console.log("ENGAGE : ", req.body);

  res.status(201).json({
    status: 'success',
    message: 'Engagement data successfully entered',
    data: entry,
  });
});

exports.updateEngagementReg = catchAsync(async (req, res, next) => {
  const update = await EngagementReg.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );

  if (!update)
    return next(new AppError(`No entry found with Id ${req.params.id}`, 404));

  res.status(201).json({
    status: 'success',
    data: update,
  });
});

exports.getMarriageRegs = catchAsync(async (req, res, next) => {
  const marriageEntries = await MarriageReg.find();

  res.status(200).json({
    status: 'success',
    data: marriageEntries,
  });
});

exports.getMarriageReg = catchAsync(async (req, res, next) => {
  //***? What if the person marries second time. [Add a field to mark marriage as invalid]

  let entry = await MarriageReg.findById(req.params.id);

  if (!entry) {
    const user = await Parishioners.findById(req.params.id).select('gender');

    if (!user)
      return next(new AppError(`No user found with Id ${req.params.id}`, 404));

    let queryObj = {};
    if (user.gender === 'M') {
      queryObj = { groomId: req.params.id, status: 'valid' };
    }
    if (user.gender === 'F') {
      queryObj = { brideId: req.params.id, status: 'valid' };
    }

    entry = await MarriageReg.findOne(queryObj);
    if (!entry) {
      return next(
        new AppError(`No entry found with id ${req.params.id}!`, 404),
      );
    }
  }
  res.status(201).json({
    status: 'success',
    data: entry,
  });
});

exports.addMarriageReg = catchAsync(async (req, res, next) => {
  //***TODO: The details of the bride/groom should automaticlly appear
  //***TODO: SHOULD NOT ADD ENTRY IF DEATH REGISTRY IS PRESENT
  //***? What if the person marries second time. [Add a field to mark marriage as invalid]

  // const user = await Parishioners.findOne({ _id: req.params.id }).select(
  //   "dob gender"
  // );

  // if (!user)
  //   return next(new AppError(`No user found with Id${req.params.id}`, 404));

  // if (!isLegalAge(user.dob, user.gender)) {
  //   return next(
  //     new AppError(`This person is under aged! Can't add to registry.`, 401)
  //   );
  // }

  const engagementEntry = await EngagementReg.findOne({
    _id: req.params.id,
    status: 'valid',
  });

  console.log('ENG : ', engagementEntry);

  if (!engagementEntry)
    return next(new AppError(`No valid engagement data found!`, 403));

  //!PROBABLY NOT NEEDED AS VALIDATIONS HAPPEN IN ENGAGEMENT
  if (engagementEntry.groomId) {
    const isMarried = await MarriageReg.findOne({
      groomId: engagementEntry.groomId,
      status: 'valid',
    });
    if (isMarried)
      return next(
        new AppError(`Valid marriage entry exists for the groom!`, 403),
      );
  }

  if (engagementEntry.brideId) {
    const isMarried = await MarriageReg.findOne({
      brideId: engagementEntry.brideId,
      status: 'valid',
    });
    if (isMarried) {
      return next(
        new AppError(`Valid marriage entry exists for the bride!`, 403),
      );
    }
  }

  // //***? What about M, F and Others
  // let queryObj = {};
  // if (user.gender === "M") {
  //   queryObj = { groomId: `${req.params.id}`, status: "valid" };
  //   // req.body.groomId = req.params.id;
  // }
  // if (user.gender === "f") {
  //   queryObj = { brideId: `${req.params.id}`, status: "valid" };
  //   // req.body.brideId = req.params.id;
  // }

  // //***TODO: Add isValidMarriage in query later

  // const isMarried = await MarriageReg.findOne(queryObj);

  // if (isMarried) {
  //   return next(new AppError("This person is already married!", 200));
  // }

  // const engagementData = await EngagementReg.findOne(queryObj);

  // if (!engagementData)
  //   return next(
  //     new AppError(
  //       `No valid engagement data found for ${user.baptismName}! Please add that before adding marriage data.`,
  //       403
  //     )
  //   );

  // console.log("ENG DATA : ", engagementData);

  if (engagementEntry.groomId) req.body.groomId = engagementEntry.groomId;
  if (engagementEntry.groomId) req.body.brideId = engagementEntry.brideId;
  req.body.groomName = engagementEntry.groomData.name;
  req.body.brideName = engagementEntry.brideData.name;

  // const register = await MarriageReg.create(req.body);

  res.status(201).json({
    status: 'success',
  });
});

exports.updateMarriagetReg = catchAsync(async (req, res, next) => {
  const update = await MarriageReg.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!update) {
    return next(new AppError(`No entry found with Id ${req.params.id}`, 404));
  }

  res.status(201).json({
    status: 'success',
    data: update,
  });
});

exports.getDeathRegs = catchAsync(async (req, res, next) => {
  console.log('Death Registry');

  res.status(201).json({
    status: 'success',
  });
});

exports.getDeathReg = catchAsync(async (req, res, next) => {
  console.log('Death Registry');

  res.status(201).json({
    status: 'success',
  });
});

exports.addDeathReg = catchAsync(async (req, res, next) => {
  const user = await Parishioners.findById(req.params.id);

  if (!user)
    return next(new AppError(`No user found with Id ${req.params.id}`, 404));

  //***!CHANGE NAME TO BAPTISM NAME
  // req.body.baptismName = user.baptismName;
  req.body.userId = user._id;
  req.body.baptismName = user.baptismName;
  req.body.dob = user.dob;
  req.body.age = calcDeathAge(user.dob, new Date(req.body.dod));

  console.log('DEAD : ', req.body);
  const deathEntry = await DeathReg.create(req.body);

  res.status(201).json({
    status: 'success',
  });
});

exports.updateDeathReg = catchAsync(async (req, res, next) => {
  console.log('Death Registry');

  res.status(201).json({
    status: 'success',
  });
});
