const catchAsync = require('../utils/catchAsync');

const Parishioners = require('../model/personModel');
const Birthdays = require('../model/birthdayModel');

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
