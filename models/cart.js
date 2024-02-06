const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }

    }],
    total:{
        type:Number,
        required:true,
        default:0
    }

})

const cartModel = mongoose.model('cart', cartSchema);

module.exports = cartModel;