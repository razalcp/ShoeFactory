const mongoose = require('mongoose')


const brandSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageName: {
        type: String,
        required: true
    },
    brandOffer: {
        type: Number,
        default: 0,
        required: true
    },
    categoryDiscountPrice:{
        type:Number,
        default:0,      
        required:true
    },
    isBlocked: {
        type: Number,
        required: true,
        default: 0
    },
    isActive: {
        type: Number,
        required: true,
        default: 0
    }
})

const Brand = mongoose.model('brand', brandSchema)

module.exports = Brand