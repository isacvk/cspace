const fs = require('fs');

const json2csv = require('json2csv').parse;

const catchAsync = require('../utils/catchAsync');

const Parishioners = require('../model/personModel');
const MarriageReg = require('../model/marriageRegistry');
const Birthdays = require('../model/birthdayModel');
const Anniversaries = require('../model/marriagesModel');
const Sponsors = require('../model/sponsorsModel');
const Offerings = require('../model/offeringsModel');

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
    if (!e.name) e.name = '-';
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
      marriageDate: e.marriageDate,
    });
  });
});

exports.clearSponsorTable = catchAsync(async () => {
  const sponsors = await Sponsors.find({ status: 'initiated' })
    .select('createdAt')
    .lean();

  if (sponsors.length === 0) return;
  console.log('Clearing sponsors initiated before 20 min...');
  sponsors.map(async (entry) => {
    const sponsor = { ...entry };

    const timePassed =
      new Date().getTime() - new Date(sponsor.createdAt).getTime();

    if (timePassed > 1200000) {
      const removeEntry = await Sponsors.findByIdAndDelete(sponsor._id);
    }
  });
});

exports.clearexpiredOfferings = catchAsync(async () => {
  const activeOfferings = await Offerings.find({ isActive: true }).lean();

  activeOfferings.map(async (offering) => {
    if (new Date(offering.festDate).getTime() < new Date().getTime()) {
      const updateOffer = await Offerings.findByIdAndUpdate(offering._id, {
        isActive: false,
      });
    }
  });
});

exports.createBdayCsv = catchAsync(async () => {
  const fields = ['baptismName', 'name', 'familyName'];
  const bdays = await Birthdays.find();

  const csv = json2csv(bdays, { fields });

  fs.writeFile('./public/bdays.csv', `${csv}`, (err) => {
    if (err) throw err;
  });
});

exports.createAnniversaryCsv = catchAsync(async () => {
  const fields = ['groomName', 'brideName', 'marriageDate'];
  const anniversaries = await Anniversaries.find();

  const csv = json2csv(anniversaries, { fields });

  fs.writeFile('./public/anniversaries.csv', `${csv}`, (err) => {
    if (err) throw err;
  });
});
