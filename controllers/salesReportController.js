const Order = require('../models/orderModel')




const showSalesReport = async (req, res) => {
 // const orderData = await Order.find({}).populate('userId').populate('products.product_id')

    // const orderData = await Order.find({}).populate('userId').populate('products.product_id').sort({ "createdAt": -1 });

 // const orderData = await Order.find({}).populate('userId').populate('products.product_id').sort({ createdAt : -1 });

 const orderData = await Order.find({
    "products.status": "Delivered"
}).populate('userId').populate('products.product_id').sort({ "createdAt": -1 });

const totalCount = await Order.countDocuments({
    "products.status": "Delivered"
});

// console.log(orderData);
const qtyData = await Order.aggregate([
    {
      $unwind: "$products"
    },
    {
      $match: {
        "products.status": "Delivered"
      }
    },
    {
      $group: {
        _id: null,
        totalQty: { $sum: "$products.qty" }
      }
    }
  ]);
  
  // Extracting the totalQty from the result
  const totalDeliveredQty = qtyData.length > 0 ? qtyData[0].totalQty : 0;
  
//   console.log("Total delivered quantity:", totalDeliveredQty);
  
 
    res.render('adminPages/salesReport', { orderData ,totalDeliveredQty,totalCount})
}






module.exports = {
    showSalesReport
    
}