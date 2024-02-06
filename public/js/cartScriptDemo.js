// const button = document.getElementsByClassName('btn btn-danger')

// var priceElement = document.getElementById('price')

// let quantity = document.getElementById('quantityField')

// let total = document.getElementById('total')

// let subTotal= document.getElementById('subtotal')

// let finalTotal = document.getElementById('finaltotal')

// let hiddenfield = document.getElementById('hiddenField')

// var p = priceElement.innerHTML.replace('₹', '')


// quantity.addEventListener('change', async () => {

//     let updatedQuantity = quantity.value

//     updateQuantity(updatedQuantity)
//     let result = p * updatedQuantity
//     var resultWithRupee = '₹' + result
//     total.innerHTML = resultWithRupee
    
//     finalTotal.innerHTML = resultWithRupee

//     const url=`http://localhost:3003/updateCartTotal?total=${result}&productid=${productid}`
//     var updateTotal= await fetch(url)
//       var data = await updateTotal.json()
//     console.log(data.success);
// })

// async function updateQuantity(value) {

//     let productid = hiddenfield.value
//     let quantity = value

//     url = `http://localhost:3003/cart?quantity=${quantity}&productid=${productid}`
//     var update = await fetch(url)
  

// }

// let productid = hiddenfield.value
// for (let i = 0; i <= button.length; i++) {

    
//     button[i].addEventListener('click', function (event) {
//         url = `http://localhost:3003/deleteCartItem?productid=${productid}`
//         const result = fetch(url)
//         const buttonClicked = event.target
//         if (result) {
//             buttonClicked.parentElement.parentElement.remove()

//         }


//     })
// }






