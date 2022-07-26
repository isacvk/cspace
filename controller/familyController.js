const multer = require('multer');
const sharp = require('sharp');

const Family = require('../model/familyModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/family');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `family-${req.params.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadFamilyPhoto = upload.single('photo');

exports.resizeFamilyPhoto = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `family-${req.params.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 400)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/family/${req.file.filename}`);

  next();
};

exports.addFamily = catchAsync(async (req, res, next) => {
  if (req.body.wardNum < 1 || req.body.wardNum > 10) {
    return next(
      new AppError('Please provide ward number between 1 and 10', 400),
    );
  }

  const addFamily = await Family.create(req.body);

  res.status(201).json({
    status: 'success',
    data: addFamily,
  });
});

exports.getFamilies = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  if (queryObj.members) {
    queryObj.members = { $size: queryObj.members };
  }
  const excludedFields = ['sort'];
  excludedFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Family.find(JSON.parse(queryStr));

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('familyName');
  }

  const getFamilies = await query;

  res.status(201).json({
    status: 'success',
    results: getFamilies.length,
    data: getFamilies,
  });
});

exports.getFamily = catchAsync(async (req, res, next) => {
  const getFamily = await Family.findById(req.params.id)
    .populate('members')
    .lean();

  if (!getFamily) {
    return next(
      new AppError(`No family found with the id ${req.params.id}!`, 404),
    );
  }
  if (req.user.role === 'User' || req.user.role === 'Accountant') {
    console.log('USER : ', req.user.uid);
    getFamily.members.forEach((member) => {
      if (member.privacyEnabled) {
        for (const key in member) {
          const memId = `${member._id}`.split('"')[0];
          if (req.user.uid !== memId) {
            if (key === 'baptismName' || key === '_id' || key === 'familyId') {
              continue;
            }
            member[key] = 'N/A';
          }
        }
      }
      //     console.log('MEM : ', member.privacyEnabled, member.id);
    });
  }

  res.status(200).json({
    status: 'success',
    results: getFamily.length,
    data: getFamily,
  });
});

exports.updateFamily = catchAsync(async (req, res, next) => {
  if (req.file) req.body.photo = req.file.filename;
  const updateFamily = await Family.findByIdAndUpdate(req.params.id, req.body);

  if (!updateFamily) {
    return next(new AppError(`No family found with Id ${req.params.id}!`, 404));
  }

  res.status(201).json({
    status: 'success',
    message: 'Family info succesfully modified',
    data: updateFamily,
  });
});
