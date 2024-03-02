function generateOrderId() {
    var orderId = Math.floor(Math.random() * 900000) + 100000;
    return orderId;
  }


  module.exports={generateOrderId}