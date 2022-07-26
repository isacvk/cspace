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

exports.getFamily = catchAsync(async (req,res,next)=>{

  if(req.body.family === 'all') getFamily = await Family.find();
  else
  getFamily = await Family.findOne({familyId:req.body.family})

  res.status(201).json({  
    status:"success",
    data:getFamily,
  })
})