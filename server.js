require("dotenv").config();
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
const MongoStore = require("connect-mongo");
const otpModel = require("./models/otpModel");
const User = require("./models/userModel");
const Product = require("./models/productModel");

const configurationMongoose = require("./config/config");

const mongoose = require("mongoose");

configurationMongoose.connection();

const app = express();

const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);

app.use(express.static("public"));
app.use("/public", express.static(path.join(__dirname, "/public")));
app.use(
  "/product_images",
  express.static(path.join(__dirname, "../public/product_images")),
);

app.set("view engine", "ejs");

// Render helper: existing images are stored as plain filenames and served from
// /public/images/..., while newly uploaded images are stored as absolute
// external URLs (e.g. Vercel Blob). This keeps both working in every template.
app.locals.imageUrl = function (value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return "/public/images/" + value;
};

const sessionSecret = process.env.SESSION_SECRET || "dev-only-insecure-session-secret";

// Use a durable MongoDB-backed session store when a database URI is configured
// (required on Vercel, where in-memory sessions are not preserved).
const sessionStore = process.env.database
  ? MongoStore.create({ mongoUrl: process.env.database, collectionName: "sessions" })
  : undefined;

app.use(
  session({
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1500000,
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
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






const PORT = process.env.PORT || 3003;

const server = app.listen(PORT, () => {
  console.log(`Server Started at port http://localhost:${PORT}`);
  console.log(`Admin interface over here http://localhost:${PORT}/admin`);
});

// Handle server errors gracefully
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please close the other application and try again.`);
  } else {
    console.error('Server error:', err);
  }
});
