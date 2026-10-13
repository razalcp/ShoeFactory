
var buttons = document.querySelectorAll('.cartBtn');
var deleteButton = document.querySelectorAll('.deleteBtn')


buttons.forEach(el => {
    el.addEventListener('click', async function () {
               
    Swal.fire({
        title: "Are you sure?",
        text: "You want to add this product to cart!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, add to cart!"
    }).then(async(result) => {
        if (result.isConfirmed) {
            var productid = el.dataset.idproduct;
            var quantity = el.dataset.quantity || 1;
            var variantId = el.dataset.variantId || '';
            var size = el.dataset.size || '';
            var color = el.dataset.color || '';

            var url = `/addToCart?productId=${productid}&quantity=${quantity}`;
            if (variantId) url += `&variantId=${variantId}`;
            if (size) url += `&size=${encodeURIComponent(size)}`;
            if (color) url += `&color=${encodeURIComponent(color)}`;

            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                Swal.fire({
                    title: "Added to cart",
                    text: "You can place your order in the cart!",
                    icon: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "OK"
                });
            } else if (data.failure && data.failure.toLowerCase().includes("select size")) {
                Swal.fire({
                    title: "Select Options",
                    text: "Please view the product details to select size and color.",
                    icon: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "View Product"
                }).then((res) => {
                    if (res.isConfirmed) {
                        window.location.href = `/userhome/productdetail?id=${productid}`;
                    }
                });
            } else {
                Swal.fire({
                    title: "Adding to cart failed",
                    text: data.failure || "The product addition has been cancelled due to no stock.",
                    icon: "warning"
                });
            }
        }
    });
});
});




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


