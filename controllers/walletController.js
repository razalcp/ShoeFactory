const User = require("../models/userModel");
const razorPayHelper = require('../helpers/razarPayHelper');
// const { json } = require("body-parser");
const Cart = require('../models/cart');



const showWallet = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Show 10 transactions per page
    const skip = (page - 1) * limit;

    const userdata = await User.findOne({ _id: req.session.user });
    
    // Sort transactions by date (newest first) and apply pagination
    if (userdata && userdata.walletTranscation) {
      // Sort transactions by date descending (newest first)
      userdata.walletTranscation.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Apply pagination
      const startIndex = skip;
      const endIndex = skip + limit;
      const paginatedTransactions = userdata.walletTranscation.slice(startIndex, endIndex);
      
      // Calculate pagination info
      const totalTransactions = userdata.walletTranscation.length;
      const totalPages = Math.ceil(totalTransactions / limit);
      
      // Replace with paginated transactions for rendering
      userdata.walletTranscation = paginatedTransactions;
      
      // Add pagination info to render
      let cartData = await Cart.findOne({ userId: req.session.user }).populate('products.productId');
      let cartQuantity = 0;
      
      if (cartData) {
        cartData.products.forEach(product => {
          cartQuantity += product.quantity;
        });
      }

      res.render('userPages/walletPage', { 
        userdata, 
        totalQuantity: cartQuantity ? cartQuantity : 0,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          nextPage: page + 1,
          prevPage: page - 1
        }
      });
    } else {
      let cartData = await Cart.findOne({ userId: req.session.user }).populate('products.productId');
      let cartQuantity = 0;
      
      if (cartData) {
        cartData.products.forEach(product => {
          cartQuantity += product.quantity;
        });
      }

      res.render('userPages/walletPage', { 
        userdata, 
        totalQuantity: cartQuantity ? cartQuantity : 0,
        pagination: {
          currentPage: 1,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
          nextPage: 2,
          prevPage: 0
        }
      });
    }
  } catch (error) {
    console.error('Error in showWallet:', error);
    res.status(500).render('error', { message: 'Error loading wallet page' });
  }
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