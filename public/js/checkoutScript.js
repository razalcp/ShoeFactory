const cartId = document.getElementById('cartidhidden').value
const addressId = document.getElementById('addresshiddenfield').value
const paymentMethord = document.getElementsByClassName('paymentOptions')
let updatedStatus;

for (let i = 0; i < paymentMethord.length; i++) {

    paymentMethord[i].addEventListener('change', async function () {

        updatedStatus = this.value;

    });
}



function orderConfirm() {

    // Swal.fire({
    //     title: "Are you sure?",
    //     text: "You want to Place the order!",
    //     icon: "warning",
    //     showCancelButton: true,
    //     confirmButtonColor: "#3085d6",
    //     cancelButtonColor: "#d33",
    //     confirmButtonText: "Yes, order now!"
    // }).then((result) => {
    //     if (result.isConfirmed) {
            createOrder();
//             Swal.fire({
//                 title: "Order Placed!",
//                 text: "The order has been placed successfully.",
//                 icon: "success"
//             });
//         } else {
//             Swal.fire({
//                 title: "Ordering cancelled!",
//                 text: "The product ordering has been cancelled.",
//                 icon: "success"
//             });
//         }
//     });
// }
}

async function createOrder() {

   const total =  document.getElementById('subTotal').innerHTML

   
    url = `/orderPlace?cartId=${cartId}&addressId=${addressId}&modeOfPayment=${updatedStatus}&total=${total}`

    const result = await fetch(url)
    var data = await result.json()
   
console.log(data.success);
    if (data.success) {
        
        razorPayPayment(data.success)
    }else if (data.message) {
        Swal.fire({
            title: "Do You want to debit Money From Wallet",
            text: "Money will be debited from Wallet balance!",
            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK"
        }).then(async (result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Ordering Successful!",
                        text: "The money has been debited from Wallet.",
                        icon: "success"
                    }).then(()=>{
                        window.location.href="/showOrderSuccessPage"
                    })

                }else{
                    window.location.href="/showOrderFaliurePage"
                }
        });
    } else {
        Swal.fire({
            title: "Ordering cancelled!",
            text: "The product ordering has been cancelled due to no wallet balance.",
            icon: "warning",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok"
        }).then(()=>{
            window.location.href="showOrderFaliurePage"
        })

           
        
    }

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

    rzp1.on('payment.failed',function (response){
        Swal.fire({
            title: "PAYMENT FAILED!",
            text: "Try paying again!",
            icon: "Danger",
            imageUrl:"/public/assetss/imgs/failed/failed.png",
            imageWidth: 200,
            imageHeight:200,
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK"
        }).then(async (result) => {
                if (result.isConfirmed) {
                   
                    window.location.href="/showOrderFaliurePage"
                }
            });
        
    })
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
            }).then(async (result) => {
                    if (result.isConfirmed) {
                       
                        window.location.href="/showOrderSuccessPage"
                    }
                });
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

