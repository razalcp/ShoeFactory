
 function deleteConfirm(couponId) {
    console.log(couponId);
    Swal.fire({
title: "Are you sure?",
text: "You want to delete this coupon!",
icon: "warning",
showCancelButton: true,
confirmButtonColor: "#3085d6",
cancelButtonColor: "#d33",
confirmButtonText: "Yes, delete it!"
}).then(async(result) => {
if (result.isConfirmed) {
   const fun =await confirmDelete(couponId); // Assuming blockProduct is your function to block the product
    if(fun){
        Swal.fire({
            title: "Deleted!",
            text: "The coupon has been deleted.",
            icon: "success"
        });
    }else{
        Swal.fire({
            title: "Delete not Possible!",
            text: "The coupon cannot be deleted.",
            icon: "Faliure"
        });
    }
   
}
});
}


async function confirmDelete(couponId){
    url=`http://localhost:3003/admin/deleteCoupon?couponId=${couponId}`
    const result = await fetch(url)
    const data = await result.json()
    if(data){
        window.location.reload();
    }
}
