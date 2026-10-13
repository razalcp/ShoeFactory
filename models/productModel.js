const mongoose = require('mongoose')

const variantSchema = new mongoose.Schema({
    size: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    imageurl: [{
        type: String,
        required: true
    }],
    isBlocked: {
        type: Number,
        required: true,
        default: 0
    }
})

const productSchema = new mongoose.Schema({

    producttitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brand',
        required: true

    },
    variants: [variantSchema],
    isProduct: {
        type: Number,
        required: true,
        default: 0
    },
    isBlocked: {
        type: Number,
        required: true,
        default: 0
    },
    productOffer: {
        type: Number,
        required: true,
        default: 0
    },
    discountPrice: {
        type: Number,
        required: true,
        default: 0
    },
    brandDiscountPrice:{
        type:Number,
        required:true,
        default:0
    },
    offerBrand:{
        type:Number,
        required:true,
        default:0
    }


})

const Product = mongoose.model('product', productSchema)

module.exports = Product