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
  // TODO: ADD VALIDATION
  const ledgers = await Ledgers.find();

  res.status(200).json({
    status: 'success',
    data: ledgers,
  });
});

exports.createLedger = catchAsync(async (req, res, next) => {
  // TODO: ADD VALIDATION - CHECK IF GROUP EXISTS - TYPES SHOULD MATCH
  const createLedger = await Ledgers.create(req.body);
  res.status(200).json({
    status: 'success',
    message: 'ledger created successfully',
    data: createLedger,
  });
});

exports.getVouchers = catchAsync(async (req, res, next) => {
  // TODO: ADD VALIDATION
  const vouchers = await Vouchers.find();

  res.status(200).json({
    status: 'success',
    data: vouchers,
  });
});

exports.createVoucher = catchAsync(async (req, res, next) => {
  // TODO: VALIDATION - CHECK IF GROUP & LEDGER EXISTS - TYPES SHOULD MATCH
  // TODO: PROBABLY GROUP ID & TYPE SHOULD BE SELECTED AUTOMATICALLY
  // TODO: DATE VALIDATION

  const createVoucher = await Vouchers.create(req.body);
  res.status(200).json({
    status: 'success',
    message: 'ledger created successfully',
    data: createVoucher,
  });
});
