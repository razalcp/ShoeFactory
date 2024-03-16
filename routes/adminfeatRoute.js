const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const upload = require('../utils/multer');
const adminMiddleWare = require('../middleware/adminMiddleware')
const couponController = require('../controllers/couponController');
const productOfferController = require('../controllers/productOfferController')
const salesReportController = require('../controllers/salesReportController')
const chartController = require('../controllers/chartController')
const bestSellingController = require('../controllers/bestSellingController')

const deleteImgInEditProduct = require('../controllers/deleteImgInEditProduct')


router.get('/home', adminController.adminHome)
router.get('/home/addproduct', adminController.addproduct)
router.post('/home/addproduct', upload.array('images', 4), adminController.addproducttodb)
router.get('/home/usermanagement', adminController.usermanagement)
router.get('/usermanagement/block', adminController.blockuser)
router.get('/usermanagement/unblock', adminController.unblockuser)

router.get('/home/listproducts', adminController.productsList)
router.get('/usermanagement/blockproduct', adminController.blockProduct)
router.get('/usermanagement/unblockproduct', adminController.unblockProduct)

router.get('/home/editproduct', adminController.editProduct)
router.post('/home/editproduct', upload.array('images', 4), adminController.editProductandUpdate)

router.get('/usermanagement/deleteproduct', adminController.deleteproduct)

router.get('/home/addBrand', adminMiddleWare.adminSession, adminController.addBrandLoad)
router.post('/home/addBrand', adminMiddleWare.adminSession, upload.single('brandImages'), adminController.insertBrand)

router.get('/editBrand' ,adminMiddleWare.adminSession,adminController.editBrand)

router.get('/home/listbrand', adminMiddleWare.adminSession, adminController.listBrand)
router.get('/home/listbrand/deletebrand', adminController.deleteBrand)
router.get('/home/listbrand/blockbrand', adminController.blockBrand)
router.get('/home/listbrand/unblockbrand', adminController.UnblockBrand)

router.get('/orderList',adminMiddleWare.adminSession,adminController.listOrders)

router.get('/orderDetail',adminMiddleWare.adminSession,adminController.orderDetails)

router.get('/updateOrderStatus',adminMiddleWare.adminSession,adminController.updateStatus)


router.get('/coupon',adminMiddleWare.adminSession,couponController.showCouponPage)

router.get('/createCoupon',adminMiddleWare.adminSession,couponController.viewCreateCouponPage)
router.post('/addCouponToDb',adminMiddleWare.adminSession,couponController.addCopounToDB)

router.get('/deleteCoupon',adminMiddleWare.adminSession,couponController.deleteCoupon)

router.get('/updateProductOffer',adminMiddleWare.adminSession,productOfferController.updateOffer)
router.get('/removeProductOffer',adminMiddleWare.adminSession,productOfferController.removeOffer)

router.get('/salesReport',adminMiddleWare.adminSession,salesReportController.showSalesReport)

router.get('/bringSalesData',adminMiddleWare.adminSession,chartController.getSalesChartData)
router.get('/bringSalesDataMonthly',adminMiddleWare.adminSession,chartController.getSalesChartDataMonthly)
router.get('/bringSalesDataYearly',adminMiddleWare.adminSession,chartController.getSalesChartDataYearly)


///////////////////////////deleteImageInEdit Product routes

router.get('/deleteImage',adminMiddleWare.adminSession,deleteImgInEditProduct.deleteImage)

router.get('/logoutadmin', adminController.logoutadmin)



// upload.fields([{name:'image'},{name:"imgs",limits:4}])





module.exports = router