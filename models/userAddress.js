const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    address:[
       { uname:{
            type:String,
            required:true
        },
        mobile:{
            type:Number,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        locality:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        pincode:{
            type:Number,
            required:true
        },
        state:{
            type:String,
            required:true
        }
    
    
    }
    ]
})


const Address =mongoose.model('Address',addressSchema)

module.exports = Address