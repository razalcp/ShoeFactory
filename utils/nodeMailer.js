
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const bodyParser = require("body-parser");
require("dotenv").config();




// Configure nodemailer with your email provider's details
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "cprazalnazim@gmail.com", // replace with your email
    pass: process.env.apppassword // replace with your email password
  },
});

// Function to generate a random OTP
const generateOTP = () => {
  return randomstring.generate({
    length: 6,
    charset: "numeric",
  });
};

// Function to send OTP via email
const sendOTP = async (email, otp) => {

  const mailOptions = {
    from: "cprazalnazim@gmail.com", // replace with your email
    to: email,
    subject: "OTP Verification",
    text: `Your OTP for verification is: ${otp}`,
  };

  const send = await transporter.sendMail(mailOptions)
  if (send) {
    console.log("OTP Send Sucessfully !!!");
  }
};

const sendMail = async (email, otp) => {

  const mailOptions = {
    from: "cprazalnazim@gmail.com", // replace with your email
    to: email,
    subject: "Password Reset Link",
    text: `${otp}`,
  };

  const send = await transporter.sendMail(mailOptions)
  if (send) {
    console.log("Link Send Sucessfully !!!");
  }
};

module.exports = { generateOTP, sendOTP, sendMail }