
const Order = require("../models/orderModel")


const viewInvoice = async (req, res) => {
  const {orderId} = req.query;
  
  const orderData = await Order.findOne({ _id: orderId }).populate('products.product_id')
 
  res.render('userPages/viewInvoice',{orderData})
}









module.exports={viewInvoice}