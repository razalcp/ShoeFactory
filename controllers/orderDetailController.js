const Order = require('../models/orderModel')

const viewOrderDetail =async (req,res) => {
    const {orderId} = req.query;
    // console.log(orderId);
    const orderData = await Order.findOne({_id:orderId}).populate('products.product_id')
    // console.log(orderData);
    res.render('userPages/orderDetails',{orderData})
}


module.exports ={viewOrderDetail}



