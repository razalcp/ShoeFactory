


function couponApply(couponId) {
    Swal.fire({
        title: "Are you sure?", 
        text: "You want to apply this coupon!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, apply!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            const del = await couponLogic(couponId);
            if (del) {
                Swal.fire({
                    title: "Applied Successfully!",
                    text: "Coupon applied.",
                    icon: "success"
                }).then(() => {
                    location.reload();
                });
            }
        } else {
            Swal.fire({
                title: "Coupon apply Cancelled!",
                text: "The coupon addition has been cancelled.",
                icon: "info"
            });
        }
    });
}

async function couponLogic(couponId) {
    try {
        const total = document.getElementById("subTotal").innerHTML;
        const url = `/applyCoupon?couponId=${couponId}&total=${encodeURIComponent(total)}`;
        const result = await fetch(url);
        const data = await result.json();

        if (data.status && data.number) {
            let couponAppliedPrice = data.number;
            let discountPrice = data.discountAmount;
            let percentage = data.discountPercentage;
            let rupeeSymbol = "₹"; 
            let priceWithRupeeSymbol = rupeeSymbol + couponAppliedPrice;
            let discountWithRupeeSymbol = rupeeSymbol + discountPrice;

            document.getElementById("subTotal").innerHTML = priceWithRupeeSymbol;
            document.getElementById("disco").innerHTML = discountWithRupeeSymbol;
            document.getElementById("discountMessage").innerHTML = percentage + "% discount applied";

            return true;
        } else {
            Swal.fire({
                icon: "error",
                title: "Coupon Error",
                text: data.message || "Failed to apply coupon"
            });
            return false;
        }
    } catch (error) {
        console.error("Error applying coupon:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something went wrong while applying the coupon."
        });
        return false;
    }
}