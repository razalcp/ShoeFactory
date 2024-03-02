const User = require("../models/userModel");
const Product = require("../models/productModel")

const viewShop=async(req,res)=>{
    const userdata = await User.findOne({ _id: req.session.user });
    const product = await Product.find({ isBlocked: 0 });

    res.render('userPages/shop',{product,userdata})
}


module.exports={viewShop}