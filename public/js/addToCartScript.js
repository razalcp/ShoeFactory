let addCart = document.getElementById('addToCart')

let productId = document.getElementById('hiddenId').value

let quantity = document.getElementById('quantity').value


function confirmAddToCart() {
    
    Swal.fire({
        title: "Are you sure?",
        text: "You want to add this Product!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, add it!"
    }).then(async(result) => {
        if (result.isConfirmed) {
            const add = await addToCart(); 

            if(add.success){
                Swal.fire({
                    title: "Added Successfully!",
                    text: "The product has been added.",
                    icon: "success"
                }) .then(async(result) => {
                    if (result.isConfirmed) {
                    window.location.reload();

                    }
                })
            } else {
                Swal.fire({
                    title: "Product addition Cancelled!",
                    text: "The product is out of stock.",
                    icon: "error"
                });
            }
        }
            
        
    });
}





async function addToCart() {


    url = `http://localhost:3003/addToCart?productId=${productId}&quantity=${quantity}`

    var cart = await fetch(url)

    var data = await cart.json()
    console.log(data.success);
    return data;

}

