const Parishioners = require('../model/personModel');
const BaptismReg = require('../model/baptismRegistry');
const EngagementReg = require('../model/engagementModel');
const MarriageReg = require('../model/marriageRegistry');
const DeathReg = require('../model/deathRegistry');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const charController = require('./chartController');

const calcAge = (dob) => {
  let birthDate = new Date(dob);
  let today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const ageCalc = (dob, candidateDate) => {
  const birthDate = new Date(dob);
  const canidDate = new Date(candidateDate);
  let age = canidDate.getFullYear() - birthDate.getFullYear();
  const m = canidDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && canidDate.getDate() < birthDate.getDate())) {
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

exports.getBaptismRegs = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };

  // const excludedFields = ['sort'];
  // excludedFields.forEach((el) => delete queryObj[el]);

  const queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  const query = BaptismReg.find(JSON.parse(queryStr));

  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort('familyName');
  // }
  const registries = await query;

  res.status(200).json({
    status: 'success',
    results: registries.length,
    data: registries,
  });
});

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
  if (!req.body.dob || !req.body.doBaptism) {
    return next(new AppError('Please provide dob and date of baptism', 400));
  }

  const dob = new Date(req.body.dob).getTime();
  const doBaptism = new Date(req.body.doBaptism).getTime();

  if (dob > doBaptism) {
    return next(
      new AppError('Baptism date can not be older than birth date!', 400),
    );
  }

  const user = await Parishioners.findById(req.params.id);

  if (!user) {
    return next(new AppError(`No user found with Id ${req.params.id}`, 404));
  }

  const age = ageCalc(req.body.dob, new Date());
  if (user.husband) {
    if (age < 18) {
      return next(
        new AppError(
          "This person has a husband in relation! So age can't be below 18",
          400,
        ),
      );
    }
  }
  if (user.wife) {
    if (age < 21) {
      return next(
        new AppError(
          "This person has a wife in relation! So age can't be below 18",
          400,
        ),
      );
    }
  }

  req.body.userId = req.params.id;
  req.body.familyId = user.familyId;
  req.body.baptismName = user.baptismName;
  req.body.name = user.name;
  req.body.gender = user.gender;

  const addEntry = await BaptismReg.create(req.body);

  if (!addEntry) {
    return next(
      new AppError('Something went wrong when adding the registry!', 500),
    );
  }

  res.status(201).json({
    status: 'success',
    data: addEntry,
  });
  // charController.generateChartData;
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

exports.getEngagementRegs = catchAsync(async (req, res, next) => {
  const registries = await EngagementReg.find();

  res.status(200).json({
    status: 'success',
    data: registries,
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
  if (user.gender === 'M')
    queryObj = { groomId: req.params.id, status: 'valid' };
  if (user.gender === 'F')
    queryObj = { brideId: req.params.id, status: 'valid' };

  //***? WHAT TO DO WHEN MULTIPLE ENTRIES ARE THERE
  const entry = await EngagementReg.findOne(queryObj);

  if (!entry)
    return next(new AppError(`No data found for ${user.baptismName}!`, 404));

  res.status(201).json({
    status: 'success',
    data: entry,
  });
});

exports.addEngagementReg = catchAsync(async (req, res, next) => {
  if (
    !req.body.groomData.dob ||
    !req.body.groomData.doBaptism ||
    !req.body.brideData.dob ||
    !req.body.brideData.doBaptism ||
    !req.body.engagementDate
  ) {
    return next(new AppError('Please specify all the dates!', 400));
  }

  if (
    new Date(req.body.groomData.dob).getTime() > req.body.groomData.doBaptism
  ) {
    return next(
      new AppError(
        "Groom's baptsim date cannot be older than birth date!",
        400,
      ),
    );
  }

  if (
    new Date(req.body.brideData.dob).getTime() > req.body.brideData.doBaptism
  ) {
    return next(
      new AppError(
        "bride's baptsim date cannot be older than birth date!",
        400,
      ),
    );
  }
  req.body.brideData.age = ageCalc(
    req.body.brideData.dob,
    req.body.engagementDate,
  );

  if (req.body.brideData.age < 18) {
    return next(new AppError('The bride is under aged!', 403));
  }

  req.body.groomData.age = ageCalc(
    req.body.groomData.dob,
    req.body.engagementDate,
  );

  if (req.body.groomData.age < 21) {
    return next(new AppError('The groom is under aged!', 403));
  }

  const user = await Parishioners.findOne({ _id: req.params.id }).select(
    'dob gender baptismName',
  );

  if (!user) {
    return next(new AppError(`No user found with Id${req.params.id}`, 404));
  }

  let partner;
  if (req.body.partnerId) {
    partner = await Parishioners.findById(req.body.partnerId).select(
      'dob gender baptismName',
    );

    if (!partner) {
      return next(
        new AppError(`No user found with Id ${req.body.partnerId}`, 404),
      );
    }

    if (
      (user.gender === 'M' && partner.gender === 'M') ||
      (user.gender === 'F' && partner.gender === 'F')
    ) {
      return next(new AppError('Same sex marriage is not allowed!', 403));
    }
  }

  let queryObj = {};
  let queryObj2 = {}; // USE THIS
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

  let engagementData = [];
  let marriageData = [];
  let engagementData2 = [];
  let marriageData2 = [];

  if (Object.keys(queryObj).length !== 0) {
    engagementData = await EngagementReg.find(queryObj);
    marriageData = await EngagementReg.find(queryObj);
  }
  if (Object.keys(queryObj2).length !== 0) {
    engagementData2 = await EngagementReg.find(queryObj2);
    marriageData2 = await EngagementReg.find(queryObj2);
  }

  if (engagementData.length !== 0 || engagementData2.length !== 0) {
    return next(new AppError('valid engagement data already extists!', 403));
  }

  if (marriageData.length !== 0 || marriageData2.length !== 0) {
    return next(new AppError('valid marriage data already extists!', 403));
  }

  const entry = await EngagementReg.create(req.body);

  if (!entry) {
    return next(new AppError('Something went wrong is adding the data'));
  }

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
  const registries = await MarriageReg.find();

  res.status(200).json({
    status: 'success',
    data: registries,
  });
});

exports.getMarriageReg = catchAsync(async (req, res, next) => {
  //***? What if the person marries second time. [Add a field to mark marriage as invalid]

  // let entry = await MarriageReg.findById(req.params.id);

  // if (!entry) {
  const user = await Parishioners.findById(req.params.id).select(
    'gender baptismName',
  );

  if (!user) {
    return next(new AppError(`No user found with Id ${req.params.id}`, 404));
  }

  let queryObj = {};
  if (user.gender === 'M') {
    queryObj = { groomId: req.params.id, status: 'valid' };
  }
  if (user.gender === 'F') {
    queryObj = { brideId: req.params.id, status: 'valid' };
  }

  const entry = await MarriageReg.findOne(queryObj).lean();

  if (!entry) {
    return next(
      new AppError(
        `No valid marriage registry found for ${user.baptismName}!`,
        404,
      ),
    );
  }
  const engData = await EngagementReg.findOne(queryObj).lean();

  // }
  entry['groomData'] = engData.groomData;
  entry['brideData'] = engData.brideData;

  res.status(201).json({
    status: 'success',
    data: entry,
  });
});

exports.addMarriageReg = catchAsync(async (req, res, next) => {
  //***TODO: SHOULD NOT ADD ENTRY IF DEATH REGISTRY IS PRESENT

  const engagementEntry = await EngagementReg.findOne({
    _id: req.params.id,
    status: 'valid',
  });

  if (!engagementEntry) {
    return next(new AppError('No valid engagement data found!', 403));
  }

  if (
    new Date(engagementEntry.engagementDate).getTime() >
    new Date(req.body.marriageDate).getTime()
  ) {
    return next(
      new AppError('Marriage date cannot be older than engagement date!', 400),
    );
  }

  if (engagementEntry.groomId) {
    const isMarried = await MarriageReg.findOne({
      groomId: engagementEntry.groomId,
      status: 'valid',
    });
    if (isMarried) {
      return next(
        new AppError('Valid marriage entry exists for the groom!', 403),
      );
    }
    req.body.groomId = engagementEntry.groomId;
  }

  if (engagementEntry.brideId) {
    const isMarried = await MarriageReg.findOne({
      brideId: engagementEntry.brideId,
      status: 'valid',
    });
    if (isMarried) {
      return next(
        new AppError('Valid marriage entry exists for the bride!', 403),
      );
    }
    req.body.brideId = engagementEntry.brideId;
  }

  if (engagementEntry.groomId) req.body.groomId = engagementEntry.groomId;
  if (engagementEntry.groomId) req.body.brideId = engagementEntry.brideId;
  req.body.groomName = engagementEntry.groomData.baptismName;
  req.body.brideName = engagementEntry.brideData.baptismName;
  req.body.groomAge = ageCalc(
    engagementEntry.groomData.dob,
    req.body.marriageDate,
  );
  req.body.brideAge = ageCalc(
    engagementEntry.brideData.dob,
    req.body.marriageDate,
  );

  const register = await MarriageReg.create(req.body);

  if (!register) {
    return next(new AppError('Registry not added! Something went wrong!', 500));
  }

  res.status(201).json({
    status: 'success',
    data: register,
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
  const registries = await DeathReg.find();

  res.status(200).json({
    status: 'success',
    data: registries,
  });
});

exports.getDeathReg = catchAsync(async (req, res, next) => {
  const registries = await DeathReg.findOne({ userId: req.params.id });

  if (!registries) {
    return next(new AppError(`No entry found with Id ${req.params.id}!`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: registries,
  });
});

exports.addDeathReg = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError('Please provide the userId', 400));
  }

  const user = await Parishioners.findById(req.params.id);

  if (!user) {
    return next(new AppError(`No user found with Id ${req.params.id}`, 404));
  }

  if (!req.body.dod || !req.body.doBurial) {
    return next(
      new AppError('Please provide date of death and date of burial', 400),
    );
  }

  const dod = new Date(req.body.dod).getTime();
  const doBurial = new Date(req.body.doBurial).getTime();

  if (dod > doBurial) {
    return next(
      new AppError('Burial date can not be before date of death!', 400),
    );
  }

  if (!user.dob) {
    return next(
      new AppError(
        'Date of birth not found! Please add baptism registry.',
        404,
      ),
    );
  }
  const dob = new Date(user.dob).getTime();

  if (dob > dod) {
    return next(new AppError('Death date can not be before birth date!', 400));
  }

  let queryObj = {};
  if (user.maritalStatus === 'married' && user.gender === 'M') {
    queryObj.groomId = user._id;
  }
  if (user.maritalStatus === 'married' && user.gender === 'F') {
    queryObj.brideId = user._id;
  }

  let marriageData;
  if (Object.keys(queryObj).length !== 0) {
    marriageData = await MarriageReg.findOne(queryObj).lean();
  }

  // IF IT FINDS INVALID MARRIAGE ALSO SHOWS ERROR
  if (marriageData) {
    const marriageDate = new Date(marriageData.marriageDate).getTime();

    if (dod < marriageDate) {
      return next(
        new AppError('Death date cannot be before marriage date!', 400),
      );
    }
  }

  req.body.familyId = user.familyId;
  req.body.familyName = user.familyName;
  req.body.wardNo = user.wardNo;

  const baptismReg = await BaptismReg.findOne({ userId: req.params.id });

  if (!baptismReg) {
    return next(
      new AppError(
        `No baptism registry found for ${user.baptismName}! Please add that before continuing`,
        403,
      ),
    );
  }

  // TODO: CHECK IF DEATH REG ALREADY EXISTS
  req.body.familyId = user.familyId;
  req.body.familyName = user.familyName;
  req.body.wardNo = user.wardNo;
  req.body.userId = user._id;
  req.body.baptismName = user.baptismName;
  req.body.dob = user.dob;
  req.body.age = calcDeathAge(user.dob, new Date(req.body.dod));

  const deathEntry = await DeathReg.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'death registry added!',
    data: deathEntry,
  });
});

exports.updateDeathReg = catchAsync(async (req, res, next) => {
  console.log('Death Registry');

  res.status(201).json({
    status: 'success',
  });
});
