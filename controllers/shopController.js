const User = require("../models/userModel");
const Product = require("../models/productModel")
const Cart = require('../models/cart');



const viewShop = async (req, res) => {
    const userdata = await User.findOne({ _id: req.session.user });
    const product = await Product.find({ isBlocked: 0 });
    let cartData = await Cart.findOne({ userId: req.session.user }).populate('products.productId')
    let cartQuantity = 0;
    if (cartData) {
        cartData.products.forEach(product => {
            // Add the quantity of each product to the totalQuantity
            cartQuantity += product.quantity;
        });
    }
    res.render('userPages/shop', { product, userdata ,totalQuantity:cartQuantity?cartQuantity:0 })
}


module.exports = { viewShop }