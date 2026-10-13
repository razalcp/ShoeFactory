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
    try {
        let validityDate = new Date();
        if (req.body.expiryDate) {
            const parsed = new Date(req.body.expiryDate);
            if (!isNaN(parsed.getTime())) {
                validityDate = parsed;
            }
        }

        const couponIn = {
            couponCode: req.body.couponCode,
            validity: validityDate,
            minPurchase: req.body.minPurchase,
            minDiscountPercentage: req.body.discount,
            maxDiscountValue: req.body.maxDiscount,
            description: req.body.description
        }

        const result = await Coupon.create(couponIn)
        if (result) {
            res.redirect('/admin/coupon')
        } else {
            res.redirect('/admin/createCoupon')
        }
    } catch (error) {
        console.error('Error adding coupon:', error.message);
        res.redirect('/admin/createCoupon');
    }
}

const applyCouponLogic = async (req, res) => {
    try {
        const { couponId, total } = req.query;
        if (!couponId || !total) {
            return res.json({ status: false, message: "Invalid request parameters" });
        }

        const couponFindData = await Coupon.findOne({ _id: couponId, isBlocked: 0 });
        if (!couponFindData) {
            return res.json({ status: false, message: "Coupon not found or inactive" });
        }

        // Check if coupon is expired
        if (couponFindData.validity && !isNaN(new Date(couponFindData.validity).getTime()) && new Date(couponFindData.validity) < new Date()) {
            return res.json({ status: false, message: "This coupon has expired" });
        }

        // Parse total price safely
        const numericTotal = parseFloat(total.replace(/[^0-9.]/g, ''));
        if (isNaN(numericTotal) || numericTotal <= 0) {
            return res.json({ status: false, message: "Invalid order total" });
        }

        // Check minimum purchase requirement
        if (couponFindData.minPurchase && numericTotal < couponFindData.minPurchase) {
            return res.json({ 
                status: false, 
                message: `Minimum purchase of ₹${couponFindData.minPurchase} required for this coupon` 
            });
        }

        const discount = couponFindData.minDiscountPercentage || 0;
        let discountAmount = Math.round((numericTotal * discount) / 100);

        // Cap discount if maxDiscountValue is set
        if (couponFindData.maxDiscountValue && discountAmount > couponFindData.maxDiscountValue) {
            discountAmount = couponFindData.maxDiscountValue;
        }

        const reducedAmount = numericTotal - discountAmount;

        // Ensure user hasn't already used this coupon
        const result = await User.findOneAndUpdate(
            { _id: req.session.user, couponApplied: { $ne: couponId } },
            { $addToSet: { couponApplied: couponId } }
        );

        if (result) {
            return res.json({ 
                status: true, 
                number: reducedAmount, 
                discountAmount: discountAmount, 
                discountPercentage: discount 
            });
        } else {
            return res.json({ status: false, message: "Coupon already used" });
        }
    } catch (error) {
        console.error("Error applying coupon:", error);
        return res.json({ status: false, message: "Error applying coupon" });
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
