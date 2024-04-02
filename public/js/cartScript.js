
const quantity = document.querySelectorAll('.quantityField')
const total = document.querySelectorAll('.totalField')
const subTotal = document.getElementById('subTotal')
// const button = document.getElementsByClassName('removeBtn')
const hiddenField = document.getElementsByClassName('hiddenField')
const productIdArray = Array.from(hiddenField)
const totalArray = Array.from(total)


const buttons = document.querySelectorAll('.removeBtn');



quantity.forEach((el, index) => {
    el.addEventListener('change', () => {
        let prize = parseInt(el.dataset.price)
        let productid = (el.dataset.id)

        let element2 = totalArray[index]

        let updatedQuantity = el.value
        updateQuantityInDataBase(updatedQuantity, productid)
        let totalPrize = updatedQuantity * prize
        // var resultWithRupee = '₹' + totalPrize

        element2.innerHTML = totalPrize





    })
})

//Function to calculate sum of inerHTML values of all elements
const calculateSum = () => {
    let sum = 0;
    total.forEach(element => {
        sum += parseInt(element.innerHTML) || 0; //Parse innerHTML to integer, default to0 if parsing failed
    });
    return sum;
};

// Create a MutationObserver for each element
totalArray.forEach(element => {
    const observer = new MutationObserver(mutationsList => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.target === element) {
                //The innerHTML of element has changed
                console.log('innerHTML has changed: ', element.innerHTML);
                //Calculate sum of innerHTML values and perform operations
                const sum = calculateSum();
                updatePriceInDataBase(sum)
                var resultWithRupee = '₹' + sum

                subTotal.innerHTML = resultWithRupee
            }
        });
    });

    //Configuration of the observer
    const config = { childList: true, subtree: true };

    //Start Observing the element for changes
    observer.observe(element, config);
});


buttons.forEach(button => {
    button.addEventListener('click', async (event) => {
          
    Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this Product!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete!"
    }).then(async(result) => {
        if (result.isConfirmed) {
            const productId = button.dataset.id;

        url = `http://localhost:3003/deleteCartItem?productid=${productId}`
        const result = await fetch(url)

        if (result) {
            const buttonClicked = event.target

            buttonClicked.parentElement.parentElement.remove()
        }

        
        if(result){
            Swal.fire({
                title: "Deleted Successfully!",
                text: "The product has been deleted.",
                icon: "error"
            }) .then(async(result) => {
                if (result.isConfirmed) {
                window.location.reload();

                }
            })
        } else {
            Swal.fire({
                title: "Product deletion not Possible!",
                text: "Error in deleting product.Please after some time!!",
                icon: "error"
            });
        }
    
            // const add = await addToCart(); 
        }
        })})
            
             
    
        



});




// Array.from(button).forEach(el=>{
//     el.addEventListener('click',async function(event){
//         let productId=button.dataset.id
//         console.log(productId);
// productIdArray .forEach(el=>{
//  const productId = el.value
//  console.log(productId);
// })

//         url = `http://localhost:3003/deleteCartItem?productid=${productId}`
//         const result = await fetch(url)

//         if(result){
//             const buttonClicked = event.target

//             buttonClicked.parentElement.parentElement.remove()
//         }

//     })
// })



// for (let i = 0; i < button.length; i++) {


//     button[i].addEventListener('click', async function (event) {
//         let productId=button[i].dataset.id

//         url = `http://localhost:3003/deleteCartItem?productid=${productId}`
//         const result = await fetch(url)

//         if(result){
//             const buttonClicked = event.target

//         buttonClicked.parentElement.parentElement.remove()
//         }



//     })
// }


async function updatePriceInDataBase(price) {
    url = `http://localhost:3003/updateCartTotal?price=${price}`
    const result = await fetch(url)
    var data = await result.json()
    console.log(data.success);

}

async function updateQuantityInDataBase(updatedQuantity, productid) {
    url = `http://localhost:3003/updateCartQuantity?quantity=${updatedQuantity}&productid=${productid}`
    const updateQty = await fetch(url)

    var data = await updateQty.json();


    if (updatedQuantity == data.stockQuantity) {

        Toastify({
            text: "Only " + data.stockQuantity + " available in the stock",
            duration: 3000,
            // destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
                // Adjust width here
                "min-width": "400px", // Set the minimum width to your desired value
                "max-width": "400px",
                fontSize: "30px"  // Set the maximum width to your desired value
            },
            onClick: function () { } // Callback after click
        }).showToast()
    } else {
        console.log(data.message)
    }


}