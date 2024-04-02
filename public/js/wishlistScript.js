

async function wishlist(productId){
    
    Swal.fire({
        title: "Are you sure?",
        text: "You want to add this Product to wishlist!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, add it!"
    }).then(async(result) => {
        if (result.isConfirmed) {
            const add = await addToWishlist(productId); 
           
            if(true){
                Swal.fire({
                    title: "Added to wishlist Successfully!",
                    text: "The product has been added.",
                    icon: "success"
                });
            } else {
                Swal.fire({
                    title: "Product addition Cancelled!",
                    text: "The product is out of stock.",
                    icon: "failure"
                });
            }
        }
            
        
    });
}


async function addToWishlist(productId){

    url=`/addToWishlist?productId=${productId}`

    const result = await fetch(url);
    const data = result.json();

    if(data.status==true){
        return true;
      
    }else{
        console.log(data.status);
    }
   

}
