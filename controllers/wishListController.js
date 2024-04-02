const Product = require('../models/productModel')
const User = require('../models/userModel')
const Wishlist=require('../models/wishListModel')
const mongoose=require('mongoose')
const wishListHelper=require('../helpers/wishListHelper')
const Order = require('../models/orderModel')
const Cart = require('../models/cart');


const getWishList = async (req, res) => {
    let userid = req.session.user;
    
const wishlistData = await Wishlist.find({user:userid}).populate('wishList.productId')
const userdata = await User.findOne({_id:req.session.user})
// console.log(wishlistData[0].wishList.productId.brandId);
let cartData = await Cart.findOne({ userId: req.session.user }).populate('products.productId')
let cartQuantity = 0;
  if(cartData){
    cartData.products.forEach(product => {
      // Add the quantity of each product to the totalQuantity
      cartQuantity += product.quantity;
    });
  }

      res.render("userPages/wishList",{wishlistData,userdata,totalQuantity:cartQuantity?cartQuantity:0 });
    };



const addToWishList = async (req, res) => {
    const{productId} = req.query
   
    let userId =req.session.user
    wishListHelper.addWishList(userId, productId).then((response) => {
   

    res.send(response);
    });
  }


  const deleteWishListItem = async (req,res)=> {
    const {productId} =req.query
 const userId = req.session.user
 const data = await Wishlist.findOne({user:userId})
// console.log(data);
    const del = await Wishlist.findOneAndUpdate({ user: userId}, { $pull: { "wishList": { "productId": productId } } },{new:true});
   
    // data.wishList.forEach(async el =>{
    //   if(el.length>0){
    //     console.log("Wishlist is not empty");
    //   }else{
    //     const dele=await Wishlist.findOneAndDelete({user:userId})

    //   }
    // })
  
const length = del.wishList.length;
// console.log(length); 
if(length===0){
 
  const dele=await Wishlist.findOneAndDelete({user:userId})
}

    try {
      if (del) {
        res.status(200).json({ message: 'Deleted successfully' });
      } else {
        res.status(404).json({ message: 'Product not found to be deleted' });
      }
    } catch (error) {
      console.log(error);
    }
  }



module.exports = { addToWishList, getWishList ,deleteWishListItem}