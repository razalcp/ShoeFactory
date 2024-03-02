const User = require('../models/userModel')
const Order =require('../models/orderModel')




const viewMyOrder= async(req,res) => {
    const userdata = await User.findOne({ _id: req.session.user });
    const orderData = await Order.find({userId:req.session.user}).populate('products.product_id').populate('address')
    console.log(orderData);
    res.render('userPages/myOrders',{userdata,orderData})
  }




  module.exports = {viewMyOrder}