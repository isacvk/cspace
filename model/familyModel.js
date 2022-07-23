const mongoose = require("mongoose")

const familySchema = new mongoose.Schema({
    houseName:{
        type:String,
        require:[true,"Please speceify the family name"]
    },
    address:{
        type:String,
        required:[true,"Please specify the address"]
    },
    houseNum:{
        type:String,
        required:[true,"Please specify the house number"]
    },
    wardNum:{
        type:Number,
        required:[true,"Please specify the ward number"]
    },
    pin:{
        type:String,
        required:[true,"Please specify the pin number"]
    },
    members: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Users",
        },
    ],
})

const Families = mongoose.model("Families", familySchema);

module.exports = Families;