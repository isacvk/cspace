const Announce = require("./../model/announceModel");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.announce = catchAsync(async (req, res, next) => {
  const makeAnnouncement = await Announce.create({
    announcement: req.body.announcement,
    date: new Date(),
  });

  res.status(200).json({
    status: "success",
    message: "announcement made!",
  });
});

exports.modifyAnnounce = catchAsync(async (req, res, next) => {
  const modifyAnnouncement = await Announce.findByIdAndUpdate(
    {
      _id: req.params.id,
    },
    {
      announcement: req.body.announcement,
    }
  );

  res.status(200).json({
    status: "success",
    message: "announcement modified!",
  });
});
exports.deleteAnnounce = catchAsync(async (req, res, next) => {
  const deleteAnnouncement = await Announce.findByIdAndDelete({
    _id: req.params.id,
  });

  res.status(200).json({
    status: "success",
    message: "announcement deleted!",
  });
});
