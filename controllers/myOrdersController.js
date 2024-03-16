const User = require('../models/userModel')
const Order = require('../models/orderModel')
const razorPayHelper = require('../helpers/razarPayHelper')



const viewMyOrder = async (req, res) => {
  const userdata = await User.findOne({ _id: req.session.user });
  const orderData = await Order.find({ userId: req.session.user }).populate('products.product_id').populate('address')
  // console.log(orderData);
  res.render('userPages/myOrders', { userdata, orderData })
}

const updateStatu = async (req, res) => {

  const { status, productId, orderId } = req.query
  // console.log("status:"+status);
  // console.log("productId:"+productId);
  // console.log("orderId:"+orderId);
  // const upgrade = await Order.findOneAndUpdate({ orderId: orderId, 'products._id': productId }, { $set: { 'products.$.status': status } })

  const upgrade = await Order.updateOne(
    {
      "orderId": orderId,
      "products.product_id": productId
    },
    {
      $set: { "products.$.status": status }
    }
  )

  // console.log(upgrade);
  if (upgrade) {
    res.status(200).json({ message: 'STATUS Updated ' });
  } else {

    res.status(500).json({ message: 'Error placing order' });
  }

}

// const paymentPending = async (req, res) => {
//   const { orderId } = req.query
//   console.log(orderId);
//   const orderData = await Order.find({ _id: orderId }).populate('products.product_id')
//   console.log(orderData);
//   let price = orderData.totalPrice;
//   if (orderData) {
//     try {
//       razorPayHelper.generateRazorpay(orderId, price).then((response) => {

//         res.status(200).json({ success: response });
//       })
//     } catch (error) {
//       console.log(error)
//     }



//   }

// }

const paymentPending = async (req, res) => {
  try {
    const { orderId } = req.query;
    console.log(orderId);
    
    const orderData = await Order.findOne({ _id: orderId }).populate('products.product_id');

    
    if (!orderData) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const price = orderData.totalPrice;


    const response = await razorPayHelper.generateRazorpay(orderId, price);
    
    res.status(200).json({ success: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = { viewMyOrder, updateStatu, paymentPending }