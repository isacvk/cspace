const Parishioners = require('../model/personModel');
const AgeChart = require('../model/ageChartModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAgeChart = catchAsync(async (req, res, next) => {
  const data = await AgeChart.find().lean();

  res.status(200).json({
    status: 'success',
    results: data.length,
    data,
  });
});

exports.createCategories = catchAsync(async (req, res, next) => {
  // const persons = await Parishioners.find({isActive:true})

  const categories = await AgeChart.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'category created',
  });
});

exports.generateChartData = catchAsync(async (req, res, next) => {
  console.log('Generate chart got called!');
  const persons = await Parishioners.find({ isActive: true }).select(
    'age gender',
  );

  const resetData = await AgeChart.updateMany({ male: 0, female: 0 });

  let queryObj = {};
  persons.map(async (person) => {
    if (person.age < 11) {
      if (person.gender === 'M') {
        const update = await AgeChart.findOneAndUpdate(
          { category: '0-10' },
          { $inc: { male: 1 } },
        );
      } else {
        const update = await AgeChart.findOneAndUpdate(
          { category: '0-10' },
          { $inc: { female: 1 } },
        );
      }
    } else if (person.age < 21) {
      if (person.gender === 'M') {
        const update = await AgeChart.findOneAndUpdate(
          { category: '11-20' },
          { $inc: { male: 1 } },
        );
      } else {
        const update = await AgeChart.findOneAndUpdate(
          { category: '11-20' },
          { $inc: { female: 1 } },
        );
      }
    } else if (person.age < 31) {
      if (person.gender === 'M') {
        const update = await AgeChart.findOneAndUpdate(
          { category: '21-30' },
          { $inc: { male: 1 } },
        );
      } else {
        const update = await AgeChart.findOneAndUpdate(
          { category: '21-30' },
          { $inc: { female: 1 } },
        );
      }
    } else if (person.age < 41) {
      if (person.gender === 'M') {
        const update = await AgeChart.findOneAndUpdate(
          { category: '31-40' },
          { $inc: { male: 1 } },
        );
      } else {
        const update = await AgeChart.findOneAndUpdate(
          { category: '31-40' },
          { $inc: { female: 1 } },
        );
      }
    } else if (person.age < 51) {
      if (person.gender === 'M') {
        const update = await AgeChart.findOneAndUpdate(
          { category: '41-50' },
          { $inc: { male: 1 } },
        );
      } else {
        const update = await AgeChart.findOneAndUpdate(
          { category: '41-50' },
          { $inc: { female: 1 } },
        );
      }
    } else if (person.age < 61) {
      if (person.gender === 'M') {
        const update = await AgeChart.findOneAndUpdate(
          { category: '51-60' },
          { $inc: { male: 1 } },
        );
      } else {
        const update = await AgeChart.findOneAndUpdate(
          { category: '51-60' },
          { $inc: { female: 1 } },
        );
      }
    } else if (person.age < 71) {
      if (person.gender === 'M') {
        const update = await AgeChart.findOneAndUpdate(
          { category: '61-70' },
          { $inc: { male: 1 } },
        );
      } else {
        const update = await AgeChart.findOneAndUpdate(
          { category: '61-70' },
          { $inc: { female: 1 } },
        );
      }
    } else if (person.age < 81) {
      if (person.gender === 'M') {
        const update = await AgeChart.findOneAndUpdate(
          { category: '71-80' },
          { $inc: { male: 1 } },
        );
      } else {
        const update = await AgeChart.findOneAndUpdate(
          { category: '71-80' },
          { $inc: { female: 1 } },
        );
      }
    } else if (person.age < 91) {
      if (person.gender === 'M') {
        const update = await AgeChart.findOneAndUpdate(
          { category: '81-90' },
          { $inc: { male: 1 } },
        );
      } else {
        const update = await AgeChart.findOneAndUpdate(
          { category: '81-90' },
          { $inc: { female: 1 } },
        );
      }
    } else if (person.age < 101) {
      if (person.gender === 'M') {
        const update = await AgeChart.findOneAndUpdate(
          { category: '91-100' },
          { $inc: { male: 1 } },
        );
      } else {
        const update = await AgeChart.findOneAndUpdate(
          { category: '91-100' },
          { $inc: { female: 1 } },
        );
      }
    } else if (person.age > 100) {
      if (person.gender === 'M') {
        const update = await AgeChart.findOneAndUpdate(
          { category: '100 above' },
          { $inc: { male: 1 } },
        );
      } else {
        const update = await AgeChart.findOneAndUpdate(
          { category: 'above' },
          { $inc: { female: 1 } },
        );
      }
    }
  });
});
