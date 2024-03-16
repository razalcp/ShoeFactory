const wishListModel=require('../models/wishListModel')
const mongoose =require('mongoose')

const  addWishList = async(userId, proId) => {
    try {
      return new Promise((resolve, reject) => {
        wishListModel.findOne({ user: userId }).then(
          (userWishList) => {
            if (userWishList) {
              let productExist = userWishList.wishList.findIndex(
                (wishList) => wishList.productId == proId
              );
              if (productExist != -1) {
                resolve({ status: false });
              } else {
                wishListModel.updateOne(
                  { user: userId },
                  {
                    $push: {
                      wishList: { productId: proId },
                    },
                  }
                ).then(() => {
                    
                  resolve({ status: true });
                });
              }
            } else {
              let wishListData = {
                user: userId,
                wishList: [{ productId:proId }],
              };
              let newWishList = new wishListModel(wishListData);
              newWishList
                .save()
                .then(() => {
                  resolve({ status: true });
                })
                .catch((err) => {
                  reject(err);
                });
            }
          }
        );
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  const getWishListCount = async (userId) => {
    try {
      return new Promise((resolve, reject) => {
        let count = 0;
        wishListModel.findOne({ user: userId }).then(
          (userWishlist) => {
            if (userWishlist) {
              count = userWishlist.length;
            }
            resolve(count);
          }
        );
      });
    } catch (error) {
      console.log(error.message);
    }
  }

//to get wishlist
const getWishListProducts = async (userId) => {
    try {
      return new Promise((resolve, reject) => {
        wishListModel.aggregate([
          {
            $match: {
              user: userId,
            },
          },
          {
            $unwind: "$wishList",
          },
          {
            $project: {
              productId: "$wishList.productId",
              createdAt: "$wishList.createdAt",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "wishListed",
            },
          },
          {
            $project: {
              productId: 1,
              createdAt: 1,
              wishListed: { $arrayElemAt: ["$wishListed", 0] },
            },
          },
        ]).then((wishListed) => {
          resolve(wishListed);
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  module.exports ={addWishList,getWishListCount,getWishListProducts}