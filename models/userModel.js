const mongoose = require('mongoose')

const userSchema =new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    mobile:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Number,
        required:true
    },
    isBlocked:{
        type:Number,
        required:true,
        default:0
    },
    isVerified:{
        type:Number,
        required:true,
        default:0

    },
    walletBalance:{
        type:Number,
        required:true,
        default:0
    },
    walletTranscation:{
        type:Array,
    },
    couponApplied:[{
        type:String,
        required:true,
        default:"sale"
    }],
    createdAt: {
        type:Date,
        default: Date.now
     }

})

const User = mongoose.model('User',userSchema)

module.exports = User