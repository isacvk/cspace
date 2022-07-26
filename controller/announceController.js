const Announce = require('../model/announceModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.announce = catchAsync(async (req, res, next) => {
  req.body.date = new Date();
  const makeAnnouncement = await Announce.create(req.body);

  res.status(200).json({
    status: 'success',
    message: 'announcement made!',
  });
});

exports.getAnnouncementPublic = catchAsync(async (req, res, next) => {
  const announcements = await Announce.find({ visibility: 'public' });

  res.status(200).json({
    status: 'success',
    results: announcements.length,
    announcements,
  });
});

exports.getAnnouncementUsers = catchAsync(async (req, res, next) => {
  const announcements = await Announce.find();

  res.status(200).json({
    status: 'success',
    results: announcements.length,
    announcements,
  });
});

exports.modifyAnnounce = catchAsync(async (req, res, next) => {
  const modifyAnnouncement = await Announce.findByIdAndUpdate(req.params.id, {
    announcement: req.body.announcement,
  });

  if (!modifyAnnouncement) {
    return next(
      new AppError(`No announcement found with id ${req.params.id}`, 404),
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'announcement modified!',
  });
});

exports.deleteAnnounce = catchAsync(async (req, res, next) => {
  const deleteAnnouncement = await Announce.findByIdAndDelete({
    _id: req.params.id,
  });

  if (!deleteAnnouncement) {
    return next(
      new AppError(`No announcement found with id ${req.params.id}`, 404),
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'announcement deleted!',
  });
});
