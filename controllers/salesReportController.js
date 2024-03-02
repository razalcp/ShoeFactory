const Order = require('../models/orderModel')




const showSalesReport = async (req, res) => {
    const orderData = await Order.find({}).populate('userId').populate('products.product_id')

console.log(orderData);
    res.render('adminPages/salesReport', { orderData })
}






module.exports = {
    showSalesReport
    
}