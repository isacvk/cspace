const Users = require("./../model/userModel")

exports.signup = async (req,res,next)=>{
        
    const password = req.body.password;
    const confirmPass = req.body.confirmPassword;
    
    if(password !== confirmPass) {
        return res.status(200).json({
            status:"fail",
            message:"Passwords didn't match"
        })
      }
    // userId,name,role,password,confirmPassword,parish,parishId,passwordChangedAt,otp,otpTime
      
    // const newUser = await Users.create(req.body)

    res.status(201).json({
        status:"sucess"
    })
}
exports.login = async (req,res,next)=>{

    res.status(201).json({
        status:"sucess"
    })
}