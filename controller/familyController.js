const Family = require("./../model/familyModel");

const AppError = require("./../utils/appError")
const catchAsync = require("./../utils/catchAsync")

exports.addFamily = catchAsync(async (req,res,next)=>{
  const addFamily = await Family.create(req.body);

  res.status(201).json({
    status:"success",
    data:addFamily,
  })
})