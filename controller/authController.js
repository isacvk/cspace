const Users = require("./../model/userModel")

const catchAsync = require("./../utils/catchAsync")
const AppError = require("./../utils/appError")

exports.signup = catchAsync(async (req,res,next)=>{
        
    const password = req.body.password;
    const confirmPass = req.body.confirmPassword;
    
    if(password !== confirmPass) return next(new AppError("Passwords does not match!",200))
   
    // const newUser = await Users.create(req.body)

    res.status(201).json({
        status:"sucess"
    })
})

exports.login = async (req,res,next)=>{
    const { userId, password } = req.body;

    if (!userId || !password) return next(new AppError("Please provide your userId and password"));

    const user = await Users.findOne({ userId }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect userId or password", 401));
    }

    res.status(200).json({
        status:"success"
    })
}