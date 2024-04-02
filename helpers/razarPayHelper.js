
const Razorpay = require('razorpay')
var instance = new Razorpay({ key_id: 'rzp_test_Agh9pxODuKBtWD', key_secret: 'MdBtgRFs5NROEU7xxiQUzChR' })

function generateRazorpay(orderId, total) {

    return new Promise((resolve, reject) => {
        var options = {
            amount: total * 100,
            currency: "INR",
            receipt: orderId,
        }
        instance.orders.create(options, function (err, order) {
            if (err) {
                reject(err);
            } else {
                // console.log(order);
                resolve(order);
            }
        })

    })

}

function verifyPayment(detail) {
    return new Promise((resolve,reject) => {

  
   const crypto = require('crypto');
   let hmac = crypto.createHmac('sha256','MdBtgRFs5NROEU7xxiQUzChR');
    
   hmac.update(detail.razorpay_order_id+'|'+detail.  razorpay_payment_id);
   hmac = hmac.digest('hex');
   if(hmac==detail.razorpay_signature){
    resolve()
   } else {
    reject()
   }

})
}



async function generateOrder_Wallet(userId,total) {
   
    return new Promise((resolve, reject) => {
        var options = {
            amount: total * 100,
            currency: "INR",
            receipt: userId,
        }
        instance.orders.create(options, function (err, order) {
            if (err) {
                reject(err);
            } else {
                // console.log(order);
                resolve(order);
            }
        })

    })

}



function verifyPaymentOfWallet(detail) {
    return new Promise((resolve,reject) => {

  
   const crypto = require('crypto');
   let hmac = crypto.createHmac('sha256','MdBtgRFs5NROEU7xxiQUzChR');
    
   hmac.update(detail.razorpay_order_id+'|'+detail.  razorpay_payment_id);
   hmac = hmac.digest('hex');
   if(hmac==detail.razorpay_signature){
    resolve()
   } else {
    reject()
   }

})
}



module.exports = { generateRazorpay ,verifyPayment ,generateOrder_Wallet,verifyPaymentOfWallet}
