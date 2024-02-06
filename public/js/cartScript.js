
const quantity = document.querySelectorAll('.quantityField')
const total = document.querySelectorAll('.totalField')
const subTotal = document.getElementById('subTotal')
const button = document.getElementsByClassName('removeBtn')
const hiddenField = document.getElementsByClassName('hiddenField')

const totalArray = Array.from(total)

quantity.forEach((el, index) => {
    el.addEventListener('change', () => {
        let prize = parseInt(el.dataset.price)
        let productid=(el.dataset.id)

        let element2 = totalArray[index]

        let updatedQuantity = el.value
        updateQuantityInDataBase(updatedQuantity,productid)
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






for (let i = 0; i <= button.length; i++) {


    button[i].addEventListener('click', async function (event) {
        let productId=button[i].dataset.id
      
        url = `http://localhost:3003/deleteCartItem?productid=${productId}`
        const result = await fetch(url)

        if(result){
            const buttonClicked = event.target

        buttonClicked.parentElement.parentElement.remove()
        }
        


    })
}


async function updatePriceInDataBase(price) {
    url = `http://localhost:3003/updateCartTotal?price=${price}`
    const result = await fetch(url)
    var data = await result.json()
    console.log(data.success);

}

async function updateQuantityInDataBase(updatedQuantity,productid) {
    url = `http://localhost:3003/updateCartQuantity?quantity=${updatedQuantity}&productid=${productid}`
    const updateQty=await fetch(url)
    var data = await updateQty.json();
    console.log(data.success);
   
}