const User = require("../models/userModel");
const razorPayHelper = require('../helpers/razarPayHelper');
// const { json } = require("body-parser");
const Cart = require('../models/cart');



const showWallet = async (req, res) => {

  const userdata = await User.findOne({ _id: req.session.user })
  let cartData = await Cart.findOne({ userId: req.session.user }).populate('products.productId')
  let cartQuantity = 0;
  
  if(cartData){
    cartData.products.forEach(product => {
      // Add the quantity of each product to the totalQuantity
      cartQuantity += product.quantity;
    });
  }

  res.render('userPages/walletPage', { userdata ,totalQuantity:cartQuantity?cartQuantity:0 })

}

const addMoneyToWallet = async (req, res) => {
  const { value } = req.query
  const userId = req.session.user

  razorPayHelper.generateOrder_Wallet(userId, value).then((response) => {

    res.status(200).json({ success: response });

  })
}


const verifyPaymentWallet = async (req, res) => {

  const { payment } = req.query
  const { order } = req.query


  let paymentData = JSON.parse(payment)

  let orderData = JSON.parse(order)

  let walletAmount = orderData.amount / 100


  razorPayHelper.verifyPaymentOfWallet(paymentData).then(async () => {


    const walletTranscation ={
      date:new Date(),
      type:'Credit',
      amount:walletAmount
    }
    const transUpgrade= await User.updateOne({_id:req.session.user},{$push:{walletTranscation:walletTranscation}})
    const upgrade = await User.findOneAndUpdate({ _id: req.session.user }, { $inc: { walletBalance: walletAmount } })
    if (upgrade) {

      res.json({ status: true })
    }

  }).catch(err => {
    console.log(err);
    res.json({ status: "Payment Failed" })
  })
}


const refundToWallet = (req, res) => {
  const { currentStatus } = req.query


}

module.exports = {
  showWallet,
  addMoneyToWallet,
  verifyPaymentWallet,
  refundToWallet
}