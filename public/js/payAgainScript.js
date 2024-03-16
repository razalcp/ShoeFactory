
var buttons = document.getElementsByClassName('paynowButton');


for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', async function() {
      
        var orderId = this.dataset.orderid;

      
       url=`http://localhost:3003/pendingPayment?orderId=${orderId}`
       const result= await fetch(url)
       var data = await result.json()
   
console.log(data.success);
    if (data.success) {
        
        razorPayPayment(data.success)
    }else if (data.message) {
        Swal.fire({
            title: "Order Placed Successfully",
            text: "You can Place another order!",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK"
        })
    } else {
        Swal.fire({
            title: "Ordering cancelled!",
            text: "The product ordering has been cancelled.",
            icon: "success"
        });
    }


    });
}



function razorPayPayment(order) {
    
    var options = {
        "key": "rzp_test_Agh9pxODuKBtWD", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Shoe Factory Company", //your business name
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
         
            verifyPayment(response, order)
        },
        "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
            "name": "Gaurav Kumar", //your customer's name
            "email": "gaurav.kumar@example.com",
            "contact": "9000090000" //Provide the customer's phone number for better conversion rates 
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();

}


async function verifyPayment(payment, order) {

    url = `/verify-payment?payment=${JSON.stringify(payment)}&order=${JSON.stringify(order)}`

    // const result = await fetch(url);

    try {
        const result = await fetch(url);
        if (result.ok) {
          
            Swal.fire({
                title: "Order Placed Successfully",
                text: "You can Place another order!",
                icon: "success",
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "OK"
            })
        } else {
            Swal.fire({
                title: "Ordering cancelled!",
                text: "The product ordering has been cancelled.",
                icon: "warning"
            });
        }
    } catch (error) {
        console.error('Error occurred during verification:', error);

    }
}

