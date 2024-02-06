const User = require("../models/userModel");
const otpModel = require("../models/otpModel");
const bcrypt = require("bcrypt");
const Product = require("../models/productModel");
const Cart = require("../models/cart");
const mailer = require('../utils/nodeMailer')
const Address = require('../models/userAddress')

const loginload = function (req, res) {
  if (req.session.user) {
    res.redirect("/userhome");
  } else {
    res.render("login");
  }
};

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

    res.render("userhome", { product, userdata, cartData: cartData ? cartData.products : [] });
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

    console.log("SENDOTP");
    console.log(userid);
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
      console.log("controlller:" + mail);
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
  const productdata = await Product.findOne({ _id: id, isProduct: 0 });
  const userdata = await User.findOne({ _id: req.session.user });
  const cartData = await Cart.findOne({ userId: req.session.user }).populate('products.productId')
  res.render("productdetailpage", { productdata, userdata, cartData: cartData ? cartData.products : [] });
};



const addToCart = async (req, res) => {
  let { productId } = req.query;
  let { quantity } = req.query;
  let userid = req.session.user;

  let products = [];

  products.push({ productId: productId, quantity: quantity });

  let cartData = {
    userId: userid,
    products: products,
  };
  console.log(cartData);

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
};


const showCart = async (req, res) => {
  const userdata = await User.findOne({ _id: req.session.user });
  let cartData = await Cart.findOne({ userId: req.session.user }).populate('products.productId')
  let cart = await Cart.findOne({ userId: req.session.user })

  res.render('userPages/cart', { cart, userdata, cartData: cartData ? cartData.products : [] })

}





// const loadCart = async function (req, res) {
//   const { productid } = req.query;
//   const { quantity } = req.query;

//   console.log("received qty= " + quantity);

//   const productdata = await Product.findOne({ _id: productid });
//   const userdata = await User.findOne({ _id: req.session.user });
//   const userid = req.session.user;

//   const currentStock = productdata.stock;
//   console.log("current stock= " + currentStock);
//   if (quantity <= currentStock) {
//     const updateQuantity = await Cart.findOneAndUpdate(
//       { 'products.productId': productid },
//       { $set: { "products.$.quantity": quantity } },
//       { new: true },
//     );
//     console.log("updatedQuantity= " + updateQuantity);
//   }

//   if (!quantity) {
//     let products=[]
//     products.push({
//       productId:productid,
//       quantity:quantity
//     })
//     const cartData = {
//       products: products,
//       userId: userid,
//     };
//     const alreadyCreated = await Cart.findOne({'products.productId': productid });

//     if (!alreadyCreated) {
//       const result = await Cart.create(cartData);
//     }
//   }

//   if (quantity == 0) {
//     const deleteData = await Cart.findOneAndDelete({ productId: productid });
//     console.log("cart Document Deleted");
//   }

//   res.render("userPages/cart", { product: productdata, userdata });
// };


const deleteCartItem = async (req, res) => {
  //this is a fetch handling route
console.log("comon");
  const { productid } = req.query;

  const del = await Cart.findOneAndUpdate({userId:req.session.user},{$pull:{"products":{"productId":productid}}})

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

    const index = cartData.products.findIndex(product => product.productId == productid);
    console.log(index);
    const value = parseInt(quantity)
    if (index !== -1) {
      // Increment the quantity of the matched product
      const updateQuery = {};
      updateQuery["products." + index + ".quantity"] = value;

      const data = await Cart.findOneAndUpdate(
        { userId: req.session.user },

        { $set: updateQuery }, { new: true }
      );
      console.log(data);
      res.status(200).json({ message: 'Quantity updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found in the cart' });
    }
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}




const checkOut = async (req, res) => {
  const { cartproductid } = req.query;

  const product = await Product.findOne({ _id: cartproductid });
  res.render("userPages/checkout", { product });
};

const showUserProfile = async (req, res) => {
  const userdata = await User.findOne({ _id: req.session.user })
  const addressData = await Address.findOne({ userId: req.session.user })

  res.render('userPages/userProfile', { userdata, addressData })
}

const editUserProfile = async (req, res) => {

  const userdata = await User.findOne({ _id: req.session.user })

  res.render('userPages/editUserProfile', { userdata })
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
      console.log("no change in password case= " + result);
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
      console.log("change in password case = " + update);
      if (update) {
        res.redirect("/userProfile")
      }
    }
  } catch (err) {
    console.log(err)
  }

}

const viewAddAddress = async (req, res) => {
  res.render('userPages/addAddress')
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
  console.log(addressId);

  const addressData = await Address.findOne({ userId: req.session.user }, { userId: 1, address: { $elemMatch: { _id: addressId } } })

  res.render('userPages/editAddress', { addressData })
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
  deleteCartItem
};
