const marriageRegistry = require("./../model/marriageRegisty");
const Parishioners = require("./../model/personModel");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

exports.addBaptismRegistry = catchAsync(async (req, res, next) => {
  console.log("Born");

  res.status(201).json({
    status: "success",
  });
});

exports.addEngagementRegistry = catchAsync(async (req, res, next) => {
  console.log("Engaged");

  res.status(201).json({
    status: "success",
  });
});

exports.addMarriageRegistry = catchAsync(async (req, res, next) => {
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

exports.addDeathRegistry = catchAsync(async (req, res, next) => {
  console.log("Death Registry");

  res.status(201).json({
    status: "success",
  });
});
