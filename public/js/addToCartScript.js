let addCart = document.getElementById('addToCart')

let productId = document.getElementById('hiddenId').value

let quantity = document.getElementById('quantity').value


function confirmAddToCart() {
    console.log();
    Swal.fire({
        title: "Are you sure?",
        text: "You want to add this Product!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, add it!"
    }).then((result) => {
        if (result.isConfirmed) {
            addToCart(); 
            Swal.fire({
                title: "Added Successfully!",
                text: "The product has been added.",
                icon: "success"
            });
        } else {
            Swal.fire({
                title: "Product addition Cancelled!",
                text: "The product addition  has been cancelled.",
                icon: "success"
            });
        }
    });
}





async function addToCart() {


    url = `http://localhost:3003/addToCart?productId=${productId}&quantity=${quantity}`

    var cart = await fetch(url)

    var data = await cart.json()
    console.log(data.success);

}

