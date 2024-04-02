const User = require("../models/userModel");
const otpModel = require("../models/otpModel");
const bcrypt = require("bcrypt");
const Product = require("../models/productModel");
const Cart = require("../models/cart");
const mailer = require('../utils/nodeMailer')
const Address = require('../models/userAddress')
const Order = require('../models/orderModel')
const razorPayHelper = require('../helpers/razarPayHelper')
const Coupon = require('../models/couponModel')
const orderIdHelper = require('../helpers/orderIdHelper')
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'some super secret...'
const Brand = require("../models/brandModel");


const loginload = function (req, res) {
  if (req.session.user) {
    res.redirect("/userhome");
  } else {
    res.render("login");
  }
};


const viewforgetPassword = async (req, res) => {
  try {
    res.render('userPages/forgotPassword')
  } catch (error) {
    console.log(error.message)
  }
}

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email: email })


    if (!user) {
      res.render('userPages/forgotPassword', { errmessage: "User not registered" })
      // res.send("User not registered")
      return;
    }
    //USer Exists and create One time Link that is valid for 15 minutes

    const secret = JWT_SECRET + user.password
    const payload = {
      email: user.email,
      id: user._id
    }
    const token = jwt.sign(payload, secret, { expiresIn: '15m' })
    const link = `http://localhost:3003/reset-password/${user._id}/${token}`
    // console.log(link);

    mailer.sendMail(user.email, link);



    res.render('userPages/forgotPassword', { message: "Password reset link send to mail" })
    // res.send("Password reset link send")
  } catch (error) {
    console.log(error);
  }
}

const viewResetPassword = async (req, res) => {
  const { id, token } = req.params
  const user = await User.findOne({ _id: id })


  if (!user) {
    res.send("Invalid User")
    return;
  }

  const secret = JWT_SECRET + user.password;

  try {
    const payload = jwt.verify(token, secret)
    res.render('userPages/reset-password', { email: user.email })
  } catch (error) {
    console.log(error.message);
    res.send(error.message)
  }

}

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password, password2 } = req.body
  const user = await User.findOne({ _id: id })


  if (!user) {
    res.send("Invalid User")
    return;
  }
  const secret = JWT_SECRET + user.password;
  try {
    const payload = jwt.verify(token, secret)
    if (password == password2) {
      let saltrounds = 13;
      const hashedpassword = await bcrypt.hash(password, saltrounds);
      const update = await User.findOneAndUpdate({ _id: id }, { $set: { password: hashedpassword } })
      if (update) {
        res.render('login', { resetPasswordmessage: "Password Reset Successful.Try Log in now " })
        // res.send("Password Reset Successful")
      }
    } else {
      res.render('userPages/reset-password', { mismatch: "Password mismatch ! Type Again" })
    }
    // console.log(password);
    // console.log(password2);
  } catch (error) {
    console.log(error.message);
    res.send(error.message)
  }
}


const loadregister = function (req, res) {
  if (req.session.user) {
    res.redirect("/userhome");
  } else if (req.session.admin) {
    res.redirect("/adminhome");
  } else {
    res.render("register");
  }
};

const loaduserHome = async function (req, res) {
  try {
    const userdata = await User.findOne({ _id: req.session.user });
    const product = await Product.find({ isBlocked: 0 });
    const cartData = await Cart.findOne({ userId: req.session.user }).populate('products.productId')

    let cartQuantity = 0;
    if (cartData) {
      cartData.products.forEach(product => {
        // Add the quantity of each product to the totalQuantity
        cartQuantity += product.quantity;
      });
    }


    res.render("userhome", { product, userdata, cartData: cartData ? cartData.products : [], totalQuantity: cartQuantity ? cartQuantity : 0 });
  } catch (err) {
    console.log(err.message);
  }
};

const loguser = async (req, res) => {
  const logemail = req.body.email;
  const logpassword = req.body.password;

  try {
    const loggeduser = await User.findOne({
      email: logemail,
    });

    if (loggeduser && loggeduser.isBlocked == 0 && loggeduser.isVerified == 1) {
      const userpassword = await bcrypt.compare(
        logpassword,
        loggeduser.password,
      );
      if (userpassword) {
        if (loggeduser.isAdmin === 1) {
          req.session.admin = loggeduser._id;

          res.redirect("/admin/home");
        } else {
          req.session.user = loggeduser._id;

          res.redirect("/userhome");
        }
      } else {
        res.render("login", { errmessage: "Login Failed !!!" });
      }
    } else {
      res.render("login", { errmessage: "Login Failed !!!" });
    }
  } catch (err) {
    console.log(err.message);
  }
};



const insertUser = async (req, res) => {
  try {
    const password = req.body.password;
    let saltrounds = 13;
    const hashedpassword = await bcrypt.hash(password, saltrounds);

    const userIn = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mob,
      password: hashedpassword,
      isAdmin: 0,
    };

    const result = await User.create(userIn);

    if (result) {
      const userid = result._id;
      res.redirect(`/Otpload?id=${userid}`);
    }
  } catch (error) {
    if (error) {
      res.render("register", { message: "Registration Failed !!!" });
    }
  }
};


const loadotpPage = function (req, res) {
  try {
    const user_id = req.query.id;

    res.render("Otpload", { user_id });
  } catch (err) {
    console.error(err);
  }
};


const submit = (req, res) => {
  const userEmail = req.body.email;

  // Perform user authentication logic here

  // Generate and send OTP
  const otp = mailer.generateOTP();


  mailer.sendOTP(userEmail, otp);

  res.send("OTP sent! Check your email.");
};


//OTP Sent Here and stored to OTP collection in database


const sendotp = async (req, res) => {
  try {
    const { userid } = req.query;
    const udata = await User.findById({ _id: userid });
    if (udata) {
      const mail = udata.email;
      const otp = mailer.generateOTP();
      console.log("OTP = " + otp);

      let saltrounds = 13;
      const hashedotp = await bcrypt.hash(otp, saltrounds);

      const otpdetails = {
        userid: userid,
        otp: hashedotp,
      };
      const otpsave = await otpModel.create(otpdetails);

      setTimeout(async () => {
        try {
          const deletedotp = await otpModel.deleteOne({ userid: userid });
          if (deletedotp) {
            console.log("otp document deleted succesfully");
          }
        } catch (err) {
          console.error(err);
        }
      }, 60000);

      mailer.sendOTP(mail, otp);
      res.json({ success: "OTP sent! Check your email." });
    } else {
      console.log("error");
      res.json({ error: "Error Failed OTP" });
    }
  } catch (err) {
    console.log(err.message);
  }
};


const verifyotp = async (req, res) => {
  const { userid, otp } = req.body;

  const doc = await otpModel.findOne({ userid: userid });
  if (doc) {
    const otpver = await bcrypt.compare(otp, doc.otp);
    if (otpver) {
      const udataupdate = await User.findByIdAndUpdate(
        { _id: userid },
        { $set: { isVerified: 1 } },
      );

      res.redirect("/login");
    } else {
      res.redirect("/Otpload");
    }
  } else {
    res.redirect("/Otpload");
  }
};


const loadProductDetail = async (req, res) => {
  const { id } = req.query;
  let productdata = await Product.findOne({ _id: id, isProduct: 0 })
  let actualPrice = productdata.price
  // ///////////////////////brand offer////////////////////////////////
  let brandId = productdata.brandId
  let brandData = await Brand.findOne({ _id: brandId })
  // console.log(brandData);
  let brandOffer = brandData.brandOffer;
  let brandDiscountPrice = actualPrice - Math.floor((actualPrice *  brandOffer / 100))
// console.log(brandDiscountPrice);

if (brandDiscountPrice!= 0) {
  let productdata = await Product.findOneAndUpdate({ _id: id }, { $set: {brandDiscountPrice: brandDiscountPrice } });

}
// ////////////////////////////////////////product offer//////////////////////////////////
  let discount = productdata.productOffer
 
  let discountPrice = actualPrice - Math.floor((actualPrice * discount / 100))
// console.log(discountPrice);


  if (discountPrice != 0) {
    let productdata = await Product.findOneAndUpdate({ _id: id }, { $set: { discountPrice: discountPrice } });

  }
  const userdata = await User.findOne({ _id: req.session.user });
  const cartData = await Cart.findOne({ userId: req.session.user }).populate('products.productId')


  let cartQuantity = 0;
  if (cartData) {
    cartData.products.forEach(product => {
      // Add the quantity of each product to the totalQuantity
      cartQuantity += product.quantity;
    });
  }
 
  res.render("productdetailpage", { productdata, userdata, cartData: cartData ? cartData.products : [], totalQuantity: cartQuantity ? cartQuantity : 0 });
};



const addToCart = async (req, res) => {
  let { productId } = req.query;
  let { quantity } = req.query;

  let userid = req.session.user;
  let productData = await Product.findOne({ _id: productId })
  let currentStock = productData.stock;

  let products = [];
  if (currentStock > 0) {
    products.push({ productId: productId, quantity: quantity });



    let cartData = {
      userId: userid,
      products: products,
    };


    let alreadyCreated = await Cart.findOne({ userId: userid });

    if (!alreadyCreated) {
      let create = await Cart.create(cartData);
    } else {
      let sameProduct = await Cart.findOne({ "products.productId": productId });
      if (!sameProduct) {
        let update = await Cart.findOneAndUpdate(
          { userId: userid },
          { $push: { products: { productId: productId, quantity: quantity } } },
          { new: true },
        );
      }
    }

    res.json({ success: "added to cart" });
  } else {
    res.json({ failure: "Out of Stock" })
  }

};


const showCart = async (req, res) => {
  const userdata = await User.findOne({ _id: req.session.user });
  let cartData = await Cart.findOne({ userId: req.session.user }).populate('products.productId')
  let cart = await Cart.findOne({ userId: req.session.user })
  let cartQuantity = 0;

  if (cartData) {
    cartData.products.forEach(product => {
      // Add the quantity of each product to the totalQuantity
      cartQuantity += product.quantity;
    });
  }

  function calculateProductTotal(product) {
    const { productId, quantity } = product;
    const { price, discountPrice } = productId;
    const totalPrice = discountPrice != null ? discountPrice * quantity : price * quantity;
    return totalPrice;
  }

  // Calculate total price for all products in the cart
  let cartTotal = 0;
  if (cartData) {
    cartData.products.forEach(product => {
      cartTotal += calculateProductTotal(product);
    });
  }


  // console.log("Cart Total:", cartTotal)
  res.render('userPages/cart', { cart, userdata, cartData: cartData ? cartData.products : [], totalQuantity: cartQuantity ? cartQuantity : 0, cartTotal: cartTotal ? cartTotal : 0 })

}



const deleteCartItem = async (req, res) => {
  //this is a fetch handling route

  const { productid } = req.query;

  const del = await Cart.findOneAndUpdate({ userId: req.session.user }, { $pull: { "products": { "productId": productid } } })

  try {
    if (del) {
      res.status(200).json({ message: 'Deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found to be deleted' });
    }
  } catch (error) {
    console.log(error);
  }
};


const updateCartTotal = async (req, res) => {
  let { price } = req.query

  const update = await Cart.findOneAndUpdate({ userId: req.session.user }, { $set: { total: price } }, { new: true })
  res.json({ success: "cart Total Updated" })

}

const updateQuantity = async function (req, res) {
  try {
    let { quantity } = req.query
    let { productid } = req.query

    let cartData = await Cart.findOne({ userId: req.session.user })
    const userId = req.session.user;

    const product = await Product.findOne({ _id: productid })
    const currentStock = product.stock

    const index = cartData.products.findIndex(product => product.productId == productid);

    const value = parseInt(quantity)
    if (currentStock >= value) {
      if (index !== -1) {
        // Increment the quantity of the matched product
        const updateQuery = {};
        updateQuery["products." + index + ".quantity"] = value;

        const data = await Cart.findOneAndUpdate(
          { userId: req.session.user },

          { $set: updateQuery }, { new: true }
        );

        // const updateStock = await Product.findOneAndUpdate({ _id: productid }, { $inc: { stock: -quantity } })

        res.status(200).json({ message: 'Quantity updated successfully', stockQuantity: currentStock });
      }
    } else {

      res.status(404).json({ message: 'Out Of Stock', stockQuantity: currentStock });

    }
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}






const showUserProfile = async (req, res) => {
  const userdata = await User.findOne({ _id: req.session.user })
  const addressData = await Address.findOne({ userId: req.session.user })
  const orderData = await Order.find({ userId: req.session.user }).populate('userId products.product_id');
  let cartData = await Cart.findOne({ userId: req.session.user }).populate('products.productId')

  const data = orderData;
  const statuses = data.map(entry => entry.products.map(product => product.status)).flat();
  // Assuming data is your array of objects
  // const prices = data.flatMap(entry => entry.products.map(product => product.productId.price));

  // console.log(prices);



  if (statuses === "Returned") {
    const update = await User.findOneAndUpdate({ _id: req.session.user }, { $set: { walletBalance: '25' } })
  }
  let cartQuantity = 0;
  if (cartData) {
    cartData.products.forEach(product => {
      // Add the quantity of each product to the totalQuantity
      cartQuantity += product.quantity;
    });
  }

  res.render('userPages/userProfile', { userdata, addressData, orderData, totalQuantity: cartQuantity ? cartQuantity : 0 })
}



const editUserProfile = async (req, res) => {
  let cartData = await Cart.findOne({ userId: req.session.user }).populate('products.productId')

  const userdata = await User.findOne({ _id: req.session.user })
  let cartQuantity = 0;
  if (cartData) {
    cartData.products.forEach(product => {
      // Add the quantity of each product to the totalQuantity
      cartQuantity += product.quantity;
    });
  }
  res.render('userPages/editUserProfile', { userdata, totalQuantity: cartQuantity ? cartQuantity : 0 })
}

const updateAddress = async (req, res) => {
  try {
    const { name, mobile, address, locality, city, pincode, state, addressId } = req.body
    const dataToUpdate = {
      uname: name,
      mobile,
      address,
      locality,
      city,
      pincode,
      state,
    }

    const addressUpdate = await Address.findOneAndUpdate({ userId: req.session.user, 'address._id': addressId }, { $set: { 'address.$': dataToUpdate } })

    if (addressUpdate) {
      res.redirect('/userProfile')
    }
  } catch (err) {
    console.log(err.message)
  }
}

const updateCredentials = async (req, res) => {
  try {
    password = req.body.password
    const userdata = await User.findOne({ _id: req.session.user })
    if (password == userdata.password) {
      let userIn = {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mob,
        password: password,
      }
      const result = await User.findOneAndUpdate({ _id: req.session.user }, { $set: { name: userIn.name, email: userIn.email, mobile: userIn.mobile } }, { new: true })
      // console.log("no change in password case= " + result);
      if (result) {
        res.redirect("/userProfile")
      }
    } else {
      let saltrounds = 13;
      const hashedpassword = await bcrypt.hash(password, saltrounds);

      let userIn = {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mob,
        password: hashedpassword,

      };
      const update = await User.findOneAndUpdate({ _id: req.session.user }, { $set: { name: userIn.name, email: userIn.email, mobile: userIn.mobile, password: userIn.password } }, { new: true })
      // console.log("change in password case = " + update);
      if (update) {
        res.redirect("/userProfile")
      }
    }
  } catch (err) {
    console.log(err)
  }

}

const viewAddAddress = async (req, res) => {
  let cartData = await Cart.findOne({ userId: req.session.user }).populate('products.productId')

  let cartQuantity = 0;
  if (cartData) {
    cartData.products.forEach(product => {
      // Add the quantity of each product to the totalQuantity
      cartQuantity += product.quantity;
    });
  }
  res.render('userPages/addAddress', { totalQuantity: cartQuantity ? cartQuantity : 0 })
}

const addAddAddress = async (req, res) => {
  let { name, mobile, address, locality, city, pincode, state } = req.body
  let addressData = await Address.findOne({ userId: req.session.user })

  let addressToAdd = [];
  addressToAdd.push({ uname: name, mobile: mobile, address: address, locality: locality, city: city, pincode: pincode, state: state })

  if (addressData) {
    const upgrade = await Address.findOneAndUpdate({ userId: req.session.user }, { $push: { address: { uname: name, mobile: mobile, address: address, locality: locality, city: city, pincode: pincode, state: state } } })
    if (upgrade) {
      res.redirect('userProfile')
    }

  } else {

    let data = {
      userId: req.session.user,
      address: addressToAdd
    }
    const result = await Address.create(data)

    if (result) {
      res.redirect('userProfile')
    }
  }

};



const editAddress = async (req, res) => {
  let { addressId } = req.query
  let cartData = await Cart.findOne({ userId: req.session.user }).populate('products.productId')


  const addressData = await Address.findOne({ userId: req.session.user }, { userId: 1, address: { $elemMatch: { _id: addressId } } })
  let cartQuantity = 0;
  if (cartData) {
    cartData.products.forEach(product => {
      // Add the quantity of each product to the totalQuantity
      cartQuantity += product.quantity;
    });
  }
  res.render('userPages/editAddress', { addressData, totalQuantity: cartQuantity ? cartQuantity : 0 })
}



const deleteUserAddress = async (req, res) => {
  let { addressId } = req.query

  const result = await Address.findOneAndUpdate({ userId: req.session.user }, { $pull: { "address": { "_id": addressId } } })
  if (result) {
    res.status(200).json({ message: 'Deleted successfully' });
  } else {
    res.status(404).json({ message: 'Address not found to be deleted' });
  }
}


const checkOut = async (req, res) => {
  const userdata = await User.findOne({ _id: req.session.user });
  let cartData = await Cart.findOne({ userId: req.session.user }).populate('products.productId')
  let cart = await Cart.findOne({ userId: req.session.user })
  const addressData = await Address.findOne({ userId: req.session.user })
  const coupons = await Coupon.find({ isBlocked: 0 })
  let cartQuantity = 0;
  if (cartData) {
    cartData.products.forEach(product => {
      // Add the quantity of each product to the totalQuantity
      cartQuantity += product.quantity;
    });
  }

  res.render("userPages/checkout", { userdata, cart, cartData: cartData ? cartData.products : [], addressData, coupons });
};



const orderPlacing = async function (req, res) {
  try {

    let { cartId } = req.query;
    let { addressId } = req.query;
    let { modeOfPayment } = req.query;
    let { total } = req.query
    // console.log(modeOfPayment);

    let number = total.substring(1);
    const addressData = await Address.findOne({ userId: req.session.user }, { _id: 0, userId: 1, address: { $elemMatch: { _id: addressId } } })
    const cartData = await Cart.findOne({ userId: req.session.user })


    const addressIn = {
      uname: addressData.address[0].uname,
      mobile: addressData.address[0].mobile,
      address: addressData.address[0].address,
      locality: addressData.address[0].locality,
      city: addressData.address[0].city,
      pincode: addressData.address[0].pincode,
      state: addressData.address[0].state
    }
    const addressToAdd = []
    addressToAdd.push(addressIn)

    const productsToAdd = []

    cartData.products.forEach(el => {
      const productIn = {
        product_id: el.productId,
        qty: el.quantity
      }

      productsToAdd.push(productIn)
    })

    let randomOrderId = orderIdHelper.generateOrderId()

    if (productsToAdd && addressToAdd) {
      const orderData = {
        orderId: randomOrderId,
        userId: req.session.user,
        address: addressToAdd,
        products: productsToAdd,
        totalPrice: number,
        paymentMethord: modeOfPayment,
      };
      const result = await Order.create(orderData)

      let orderId = result._id;
      let price = result.totalPrice


      if (result) {
        const orderData = await Order.findOne({ _id: orderId })

        orderData.products.forEach(async el => {
          const productId = el.product_id;
          const quantity = el.qty;

          const productdata = await Product.findOne({ _id: productId })
          const productStock = productdata.stock
          if (productStock > 0) {
            const updateStock = await Product.findOneAndUpdate({ _id: productId }, { $inc: { stock: -quantity } })

          } else if (productStock <= 0) {
            const updateStock = await Product.findOneAndUpdate({ _id: productId }, { $set: { stock: 0 } })
          }
        })


        const delcart = await Cart.findOneAndDelete({ _id: cartId })

        if (result.paymentMethord == 'Cash on Delivery') {

          res.status(200).json({ message: 'Order placed successfully' });

        } else if (result.paymentMethord == 'Wallet') {

          const walletTranscation = {
            date: new Date(),
            type: 'Debit',
            amount: price
          }

          const data = await User.findOne({ _id: req.session.user })

          let balance = data.walletBalance

          if (balance > price) {

            const transWalletUpdate = await User.updateOne({ _id: req.session.user }, { $push: { walletTranscation: walletTranscation } })
            const userData = await User.findOneAndUpdate({ _id: req.session.user }, { $inc: { walletBalance: -price } });
            res.status(200).json({ message: 'Order placed successfully' });

          } else {

            res.status(500).json({ error: 'Error placing order' });
          }

        } else {

          razorPayHelper.generateRazorpay(orderId, price).then((response) => {

            res.status(200).json({ success: response });

          }).catch(er => {
            console.log(er);
          })
        }

      }
    }


  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order' });
  }

}


const verifyPayment = async (req, res) => {

  const { payment } = req.query
  const { order } = req.query
  //  console.log(JSON.parse(payment));

  let orderData = JSON.parse(order)

  // console.log(orderData);
  razorPayHelper.verifyPayment(JSON.parse(payment)).then(async () => {
    let status = 'Payment Successful'


    const upgrade = await Order.findOneAndUpdate({ _id: orderData.receipt }, { $set: { paymentStatus: status } })
    if (upgrade) {

      res.json({ status: true })
    }

  }).catch(err => {
    console.log(err);
    res.json({ status: "Payment Failed" })
  })
}

const viewBlog = async (req, res) => {
  const userdata = await User.findOne({ _id: req.session.user });
  let cartData = await Cart.findOne({ userId: req.session.user }).populate('products.productId')
  let cartQuantity = 0;
  if (cartData) {
    cartData.products.forEach(product => {
      // Add the quantity of each product to the totalQuantity
      cartQuantity += product.quantity;
    });
  }
  res.render('userPages/blog-grid', { userdata, totalQuantity: cartQuantity ? cartQuantity : 0 })
}





const logoutuser = (req, res) => {
  if (req.session.user || req.session.admin) {
    req.session.destroy((err) => {
      if (err) {
        console.log("error in logging out");
      } else {
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/login");
  }
};


module.exports = {
  loadregister,
  loaduserHome,
  loguser,
  insertUser,
  loadotpPage,
  verifyotp,
  // loadhome,
  loginload,
  viewforgetPassword,
  forgetPassword,
  loadProductDetail,
  logoutuser,
  checkOut,
  updateCartTotal,
  addToCart,
  showCart,
  submit,
  sendotp,
  updateQuantity,
  showUserProfile,
  editUserProfile,
  updateCredentials,
  viewAddAddress,
  addAddAddress,
  editAddress,
  updateAddress,
  deleteUserAddress,
  deleteCartItem,
  orderPlacing,
  verifyPayment,
  viewBlog,
  viewResetPassword,
  resetPassword

};
