
const couponTag = document.getElementById('couponCode')
const couponForm = document.getElementById('couponForm')
const error1 = document.getElementById('error1')
const error2 = document.getElementById('error2')
const minPurchase = document.getElementById('minPurchase')
const discount = document.getElementById('discount')
const error3 = document.getElementById('error3')
const maxDiscount =document.getElementById('maxDiscount')
const error4 = document.getElementById('error4')
const descriptionBox= document.getElementById('descriptionBox')
const error5 = document.getElementById('error5')
const expiryDate = document.getElementById('expiryDate')


function validateCouponCode() {
    let value1 = couponTag.value;
    let couponRegx = /^(?!^[0-9])(?!\\d+$)[a-zA-Z][a-zA-Z0-9]*$(?!.*\.)/

    


    if (value1.trim() === "" || !couponRegx.test(value1)) {
        error1.style.display = "block"
        error1.innerHTML = "Please Enter a valid Coupon Code"
    }
    else {
        error1.innerHTML = ""
        error1.style.display = "none"

    }
}

function validatePurchase() {
    let value2 = minPurchase.value;
    let minPurchaceRegex = /^(?!0)[^\s.!@#$%^&*()_+-][0-9]+$/;


    if (value2.trim() === "" || !minPurchaceRegex.test(value2)) {
        error2.style.display = "block"
        error2.innerHTML = "Please Enter a valid Purchase Amount"
    }
    else {
        error2.innerHTML = ""
        error2.style.display = "none"

    }
}

function validateDiscount() {
    let value3 = discount.value;
    let discountRegex = /^(?!0)[^\s.!@#$%^&*()_+-][0-9]+$/;


    if (value3.trim() === "" || !discountRegex.test(value3)) {
        error3.style.display = "block"
        error3.innerHTML = "Please Enter a valid discount Amount"
    }
    else {
        error3.innerHTML = ""
        error3.style.display = "none"

    }
}

function validateMaxDiscount() {
    let value4 = maxDiscount.value;
    let maxDiscountRegex = /^(?!0)[^\s.!@#$%^&*()_+-][0-9]+$/;


    if (value4.trim() === "" || ! maxDiscountRegex.test(value4)) {
        error4.style.display = "block"
        error4.innerHTML = "Please Enter a valid Amount"
    }
    else {
        error4.innerHTML = ""
        error4.style.display = "none"

    }
}


function validateDescriptionBox(){
    let value5 = descriptionBox.value;
    


    if (value5.trim() === "" ) {
        error5.style.display = "block"
        error5.innerHTML = "Please Enter a valid Description"
    }
    else {
        error5.innerHTML = ""
        error5.style.display = "none"

    }
}



couponTag.addEventListener('blur', validateCouponCode)
minPurchase.addEventListener('blur', validatePurchase)
discount.addEventListener('blur',validateDiscount)
maxDiscount.addEventListener('blur',validateMaxDiscount)
descriptionBox.addEventListener('blur',validateDescriptionBox)

couponForm.addEventListener('submit', function (e) {
    validateCouponCode();
    validatePurchase(),
    validateDiscount()
    validateMaxDiscount()
    if (error1.innerHTML ||error2.innerHTML || error3.innerHTML || error4.innerHTML||expiryDate.innerHTML||error5.innerHTML) {
        e.preventDefault()      
    }
    else {
        console.log("prevented");
    }
})



