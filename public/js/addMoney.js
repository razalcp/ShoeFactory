

function addMoneyConfirm() {

    Swal.fire({
        title: "Are you sure?",
        text: "Do You want to Add Money To Your Wallet!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Add Money!"
    }).then(async (result) => {
        if (result.isConfirmed) {

            let val = document.getElementById('amount').value

            const del = await addMoney(val);
            if (del) {
                Swal.fire({
                    title: "Confirmed!",
                    text: "Money Addition initiated.",
                    icon: "success"
                }).then(() => {
                    location.reload()
                })

            }
        } else {
            Swal.fire({
                title: "Money Addition Cancelled!",
                text: "The addition of money has been cancelled.",
                icon: "success"
            });
        }
    });
}


async function addMoney(money) {

    url = `http://localhost:3003/addmoney?value=${money}`
    const result = await fetch(url)
    const data = await result.json()
    if (data.success) {
        razorPayPayment(data.success)
    }

}


function razorPayPayment(order) {
    var options = {
        "key": "rzp_test_Agh9pxODuKBtWD", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Acme Corp", //your business name
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
    console.log(payment);
    console.log(order);
    url = `/verify-paymentForWallet?payment=${JSON.stringify(payment)}&order=${JSON.stringify(order)}`

    const result = await fetch(url);

    const data = await result.json()
    if (data.status==true) {
        window.location.reload()
    }else{
        console.log(data.status);
    }


}