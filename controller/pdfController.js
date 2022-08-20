const Persons = require("./../model/personModel");
const marriageRegistry = require("./../model/marriageRegistry");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const template = require("../templates/generalInfo");

const pdf = require("html-pdf");
const jwt = require("jsonwebtoken");

exports.personPdf = catchAsync(async (req, res, next) => {
  const data = await Persons.findById(req.params.id);

  if (!data)
    return next(new AppError(`No user found with ID ${req.params.id}`, 404));

  pdf
    .create(template.generalInfo(data), {})
    .toFile("./public/general-info.pdf", (err) => {
      if (err) {
        return Promise.reject();
      }
      return Promise.resolve();
    });
  res.status(200).json({
    status: "success",
    message: "PDF created. You can download now!",
    link: "/general-info.pdf",
  });
});

const signToken = (credentials) => {
  return jwt.sign(credentials, process.env.JWT_SECRET);
};

exports.marriagePdf = catchAsync(async (req, res, next) => {
  let data = await marriageRegistry.findById(req.params.id);

  if (!data)
    return next(new AppError(`No user found with ID ${req.params.id}`, 404));

  const pdfConfig = {
    format: "A4",
    orientation: "portrait",
    border: {
      top: "2cm",
      right: "1cm",
      bottom: "2cm",
      left: "1.5cm",
    },
  };

  const credentials = {
    to: data._id,
    for: "marriage",
  };

  data.signature = signToken(credentials);

  console.log("SIGN : ", data.signature);

  pdf
    .create(template.marriageInfo(data), pdfConfig)
    .toFile("./public/marriage-info.pdf", (err) => {
      if (err) {
        return Promise.reject();
      }
      return Promise.resolve();
    });

  res.status(200).json({
    status: "success",
    message: "PDF created. You can download now!",
    link: "/general-info.pdf",
  });
});
