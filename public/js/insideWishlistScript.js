
var buttons = document.querySelectorAll('.cartBtn');
var deleteButton = document.querySelectorAll('.deleteBtn')


buttons.forEach(el => {
    el.addEventListener('click', async function () {
               
    Swal.fire({
        title: "Are you sure?",
        text: "You want to add this Product to cart!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete!"
    }).then(async(result) => {
        if (result.isConfirmed) {
            var productid = el.dataset.idproduct;
        var quantity = el.dataset.quantity;
        url = `/addToCart?productId=${productid}&quantity=${quantity}`
        const result = await fetch(url)
        const data = await result.json()
        console.log(data.success);
        if (data.success) {

            Swal.fire({
                title: "Added to cart ",
                text: "You can Place order in cart!",
                icon: "success",
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "OK"
            })
        } else {
            Swal.fire({
                title: "Adding to cart cancelled! No Stock ",
                text: "The product addition has been cancelled due to no stock.",
                icon: "warning"
            });
        }
        }
        
    })
})
})




deleteButton.forEach(el => {
    el.addEventListener('click', async function () {

        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this Product from wishlist!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                var productid = el.dataset.idproduct;

                url = `/deleteWishListItem?productId=${productid}`
                const result = await fetch(url)
                const data = await result.json()
                console.log(data.message);
                if (data.message) {

                    Swal.fire({
                        title: "Item Deleted Successfully ",
                        text: "You can add another product to wishlist!",
                        icon: "error",
                        showCancelButton: false,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "OK"
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    })

                } else {
                    Swal.fire({
                        title: "Deletion not Possible!",
                        text: "The product deletion is not possible.",
                        icon: "warning"
                    });
                }
            }
        })


    })
})


