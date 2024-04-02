const User = require("../models/userModel");
const Brand = require('../models/brandModel');
const Coupon = require('../models/couponModel');
const Order = require("../models/orderModel");


const showCouponPage = async (req, res) => {


    const user = await User.find({ isAdmin: 0 });
    const coupon = await Coupon.find({})

    res.render('adminPages/couponPage', { user, coupon })
}

const viewCreateCouponPage = async (req, res) => {
    const brand = await Brand.find({ isBlocked: 0 });
    const user = await User.find({ isAdmin: 0 });

    res.render('adminPages/createCoupon', { user, brand })
}



const addCopounToDB = async (req, res) => {
    const couponIn = {
        couponCode: req.body.couponCode,
        validity: req.body.expiryDate,
        minPurchase: req.body.minPurchase,
        minDiscountPercentage: req.body.discount,
        maxDiscountValue: req.body.maxDiscount,
        description: req.body.description
    }


 
    const result = await Coupon.create(couponIn)
    if (result) {
        res.redirect('/admin/coupon')
    }
}

const applyCouponLogic = async (req, res) => {
    const userData = await User.findOne({ _id: req.session.user })
    
    const { couponId } = req.query;
    const { total } = req.query;


    const couponFindData = await Coupon.findOne({ _id: couponId })


    let number = total.substring(1); // Remove the first character (rupee symbol)


    const discount = couponFindData.minDiscountPercentage;
    const couponName = couponFindData.couponCode

    const result = await User.findOneAndUpdate(
        { _id: req.session.user, couponApplied: { $ne: couponId} },
        { $addToSet: { couponApplied : couponId } })

    const used = "Coupon already used"
    if (result) {
        const update = await Coupon.findOneAndUpdate({_id: couponId},{$set:{isBlocked:1}})
        const reducedAmount = number-(number * discount / 100);
       const discountAmount = number* discount /100;
        if (reducedAmount) {

            res.json({ status: true, number: reducedAmount ,discountAmount:discountAmount?discountAmount:0 ,discountPercentage:discount?discount:0})
        }
``
    } else {
        res.json({ status: false, message: used })
    }

}

const deleteCoupon = async (req,res) => {
    const {couponId} = req.query;
   const result = await Coupon.findOneAndDelete({_id:couponId})
   if (result) {

    res.json({ status: true})
}

 else {
res.json({ status: false})
}

}
module.exports = {
    showCouponPage,
    viewCreateCouponPage,
    addCopounToDB,
    applyCouponLogic,
    deleteCoupon
}
