const Accounts = require('../model/accountsModel');
const Groups = require('../model/groupsModel');
const Ledgers = require('../model/ledgersModel');
const Vouchers = require('../model/voucherModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createAccount = catchAsync(async (req, res, next) => {
  // TODO: ADD VALIDATIONS

  const createAccount = await Accounts.create(req.body);

  res.status(200).json({
    status: 'success',
    message: 'accounts data successfully created',
    data: createAccount,
  });
});

exports.getGroups = catchAsync(async (req, res, next) => {
  // TODO: ADD VALIDATION
  const groups = await Groups.find();

  res.status(200).json({
    status: 'success',
    data: groups,
  });
});

exports.createGroup = catchAsync(async (req, res, next) => {
  // TODO: ADD VALIDATIONS
  const createGroup = await Groups.create(req.body);

  res.status(200).json({
    status: 'success',
    message: 'group created successfully',
    data: createGroup,
  });
});

exports.getLedgers = catchAsync(async (req, res, next) => {
  const ledgers = await Ledgers.find();

  res.status(200).json({
    status: 'success',
    data: ledgers,
  });
});

exports.createLedger = catchAsync(async (req, res, next) => {
  const group = await Groups.findById(req.body.groupId);

  if (!group) {
    return next(
      new AppError(`No group found with Id ${req.body.groupId}`, 404),
    );
  }

  if (group.type !== req.body.type) {
    return next(
      new AppError("The types between group and ledger doesn't match!", 400),
    );
  }

  req.body.groupName = group.name;
  req.body.type = group.type;

  const createLedger = await Ledgers.create(req.body);

  res.status(200).json({
    status: 'success',
    message: 'ledger created successfully',
    data: createLedger,
  });
});

exports.getVouchers = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ['sort', 'page', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  if (queryObj.date.gte) queryObj.date.gte = new Date(queryObj.date.gte);
  if (queryObj.date.lte) queryObj.date.lte = new Date(queryObj.date.lte);
  if (queryObj.date.gt) queryObj.date.gt = new Date(queryObj.date.gt);
  if (queryObj.date.lt) queryObj.date.lt = new Date(queryObj.date.lt);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  const query = Vouchers.find(JSON.parse(queryStr));
  // TODO: ADD SORTING FUNCTIONALITY - CHANGE CONST TO LET^

  const vouchers = await query;

  res.status(200).json({
    status: 'success',
    data: vouchers,
  });
});

exports.createVoucher = catchAsync(async (req, res, next) => {
  // TODO: DATE VALIDATION

  const ledger = await Ledgers.findById(req.body.ledgerId);

  if (!ledger) {
    return next(
      new AppError(`No ledger found with Id ${req.body.ledgerId}`, 404),
    );
  }

  if (req.body.type !== ledger.type) {
    return next(
      new AppError("The types between voucher and ledger doesn't match!", 400),
    );
  }

  req.body.ledgerName = ledger.name;
  req.body.groupId = ledger.groupId;
  req.body.groupName = ledger.groupName;

  const createVoucher = await Vouchers.create(req.body);
  res.status(200).json({
    status: 'success',
    message: 'ledger created successfully',
    data: createVoucher,
  });
});
