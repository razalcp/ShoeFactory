const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const middle =require('../middleware/userMiddleware')



router.get('/',middle.usersession,userController.loaduserHome)




router.get("/productdetail",userController.loadProductDetail)

// router.get("/productdetail",middle.userToLogin,userController.loadProductDetail)









module.exports = router