const catchAsync = require('../utils/catchAsync');

const Parishioners = require('../model/personModel');
const MarriageReg = require('../model/marriageRegistry');
const Birthdays = require('../model/birthdayModel');
const Anniversaries = require('../model/marriagesModel');

exports.generateBdayList = catchAsync(async () => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;

  const birthdays = await Parishioners.find({
    dobDay: day,
    dobMonth: month,
    isActive: true,
  });

  await Birthdays.deleteMany();

  birthdays.map(async (e) => {
    const birthdayList = await Birthdays.create({
      baptismName: e.baptismName,
      name: e.name,
      familyName: e.familyName,
    });
  });
});

exports.generateMarriageAnniversayList = catchAsync(async () => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;

  const anniversaries = await MarriageReg.find({
    marriageDay: day,
    marriageMonth: month,
    status: 'valid',
  });

  await Anniversaries.deleteMany();

  anniversaries.map(async (e) => {
    const anniversaryList = await Anniversaries.create({
      groomName: e.groomName,
      brideName: e.brideName,
    });
  });
});
