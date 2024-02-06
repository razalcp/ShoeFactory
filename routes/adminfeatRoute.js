const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const upload = require('../utils/multer');
const adminMiddleWare = require('../middleware/adminMiddleware')

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

router.get('/home/listbrand', adminMiddleWare.adminSession, adminController.listBrand)
router.get('/home/listbrand/deletebrand', adminController.deleteBrand)
router.get('/home/listbrand/blockbrand', adminController.blockBrand)
router.get('/home/listbrand/unblockbrand', adminController.UnblockBrand)




router.get('/logoutadmin', adminController.logoutadmin)



// upload.fields([{name:'image'},{name:"imgs",limits:4}])





module.exports = router