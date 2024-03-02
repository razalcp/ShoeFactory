const User = require("../models/userModel");
const razorPayHelper = require('../helpers/razarPayHelper');
// const { json } = require("body-parser");




const showWallet = async (req, res) => {
  const userdata = await User.findOne({ _id: req.session.user });

  res.render('userPages/walletPage', { userdata })

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