const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const walletController = require('../controllers/walletController')
const shopController = require('../controllers/shopController')
const couponController = require('../controllers/couponController')
const myOrderController = require('../controllers/myOrdersController')
const middle = require('../middleware/userMiddleware')

router.get('/', userController.loaduserHome)


router.get('/login', userController.loginload)
router.post('/login', userController.loguser)

router.get('/logout', userController.logoutuser)


router.get('/register', userController.loadregister)
router.post('/register', userController.insertUser)
router.get('/Otpload', userController.loadotpPage)
router.get('/sendotp',userController.sendotp)
router.get('/submit',userController.submit)
router.post("/email-verification", userController.verifyotp)


router.get('/addToCart',middle.userToLogin,userController.addToCart)

router.get('/deleteCartItem', middle.userToLogin, userController.deleteCartItem)

// router.get('/updateCartTotal', middle.userToLogin, userController.updateCartTotal)

router.get('/checkout', middle.userToLogin, userController.checkOut)
router.get('/orderPlace',middle.userToLogin,userController.orderPlacing)

router.get('/cart',middle.userToLogin,userController.showCart)

router.get('/updateCartTotal',  middle.userToLogin,userController.updateCartTotal)

router.get('/updateCartQuantity',middle.userToLogin,userController.updateQuantity)

router.get('/userProfile',middle.userToLogin,userController.showUserProfile)

router.get('/editUserProfile',middle.userToLogin,userController.editUserProfile)

router.post('/updateCredentials',middle.userToLogin,userController.updateCredentials)

router.get('/addAddress',middle.userToLogin,userController.viewAddAddress)

router.post('/addAddress',middle.userToLogin,userController.addAddAddress)

router.get('/editAddress',middle.userToLogin,userController.editAddress)
router.post('/editAddress',middle.userToLogin,userController.updateAddress)

router.get('/deleteAddress',middle.userToLogin,userController.deleteUserAddress)

router.get('/updateOrderStatus',middle.userToLogin,userController.updateStatus)

router.get('/forgetPassword',userController.forgetPassword)


router.get('/verify-payment',middle.userToLogin,userController.verifyPayment)

router.get('/wallet',middle.userToLogin,walletController.showWallet)

router.get('/addmoney',middle.userToLogin,walletController.addMoneyToWallet)

router.get('/verify-paymentForWallet',middle.userToLogin,walletController.verifyPaymentWallet)

router.get('/shop',middle.userToLogin,shopController.viewShop)

router.get('/initiateRefund',middle.userToLogin,walletController.refundToWallet)

router.get('/blog',userController.viewBlog)
router.get('/myOrder',middle.userToLogin,myOrderController.viewMyOrder);


router.get('/applyCoupon',middle.userToLogin,couponController.applyCouponLogic)


 










module.exports = router