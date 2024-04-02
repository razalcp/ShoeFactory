


function couponApply(couponId) {
    
    Swal.fire({
        title: "Are you sure?", 
        text: "You want to apply this coupon!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes apply!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            const del = await couponLogic(couponId);
            if (del) {
                Swal.fire({
                    title: "Applied Successfully!",
                    text: "Coupon applied.",
                    icon: "success"
                }).then(() => {
                    location.reload()
                })

            }
        } else {
            Swal.fire({
                title: "Coupon apply Cancelled!",
                text: "The coupon addition has been cancelled.",
                icon: "faliure"
            });
        }
    });
}

async function couponLogic(couponId) {
    console.log(couponId);
    const total = document.getElementById("subTotal").innerHTML


    url = `http://localhost:3003/applyCoupon?couponId=${couponId}&total=${total}`
    const result = await fetch(url)
    var data = await result.json();
    let couponAppliedPrice = data.number;
   let discountPrice =data.discountAmount
   let percentage = data.discountPercentage;
    let rupeeSymbol = "₹"; 
    let priceWithRupeeSymbol = rupeeSymbol + couponAppliedPrice;
    let discountWithRupeeSymbol = rupeeSymbol+discountPrice;

  if(data.number){
    document.getElementById("subTotal").innerHTML = priceWithRupeeSymbol ;
    document.getElementById("disco").innerHTML = discountWithRupeeSymbol  ;
    document.getElementById("discountMessage").innerHTML = percentage+"% discount applied" ;

    // window.location.reload();
  }else{
    alert(data.message)
  }

}