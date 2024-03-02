const mongoose = require('mongoose')


const productSchema =new mongoose.Schema({

    producttitle:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    brandId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'brand',
        required:true
        
    },
    price:{
        type:Number,
        required:true
    },
    imageurl:[{
        type:String,
        required:true
    }],
    isProduct:{
        type:Number,
        required:true
    },
    isBlocked:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true,
        
    },
    productOffer:{
        type:Number,
        required:true,
        default:0
    },
    discountPrice:{
        type:Number,
        required:true,
        default:0
    }
   

})

const Product = mongoose.model('product',productSchema)

module.exports = Product