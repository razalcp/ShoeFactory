const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')




router.get('/',adminController.adminLogin)
router.post('/',adminController.admincheck)



module.exports=router