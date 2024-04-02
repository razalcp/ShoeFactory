const jsPDF = require('jspdf');
const jwt = require('jsonwebtoken')
var toastifyJs = require("toastify-js")
const express = require("express");
const path = require("path");
const nocache = require("nocache");
const userAuthRoute = require("./routes/userauth");
const userfeatRoute = require("./routes/userfeat");
const adminRoute = require("./routes/adminRoutes");
const adminfeatRoute = require("./routes/adminfeatRoute");
const multer = require("multer");
const Swal = require("sweetalert2");
const bcrypt = require("bcrypt");
const morgan = require("morgan");
const session = require("express-session");
require("dotenv").config();
const otpModel = require("./models/otpModel");
const User = require("./models/userModel");
const Product = require("./models/productModel");

const configurationMongoose = require("./config/config");

const mongoose = require("mongoose");

configurationMongoose.connection();

const app = express();

app.use(express.static("public"));
app.use("/public", express.static(path.join(__dirname, "/public")));
app.use(
  "/product_images",
  express.static(path.join(__dirname, "../public/product_images")),
);



app.set("view engine", "ejs");

app.use(
  session({
    secret: "1231fredggg35",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1500000,
    },
  }),
);
//////forget password changes
app.use(express.json())
//////////
app.use(express.urlencoded({ extended: true }));

app.use(nocache());

app.use("/", userAuthRoute);
app.use("/userhome", userfeatRoute);
app.use("/admin", adminRoute);
app.use("/admin", adminfeatRoute);






app.listen(process.env.PORT, () => {
  console.log("Server Started at port  http://localhost:3003");
  console.log("Admin interface over here http://localhost:3003/admin");
});
