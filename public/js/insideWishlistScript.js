
var buttons = document.querySelectorAll('.cartBtn');
var deleteButton = document.querySelectorAll('.deleteBtn')


buttons.forEach(el =>{
    el.addEventListener('click', async function() {
      
        var productid = el.dataset.idproduct;
        var quantity = el.dataset.quantity;
      url=`/addToCart?productId=${productid}&quantity=${quantity}`
      const result = await fetch(url)
      const data = await result.json()
      console.log(data.success);
      if(data.success){
    
        Swal.fire({
            title: "Added to cart ",
            text: "You can Place another order in cart!",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK"
        })
    } else {
        Swal.fire({
            title: "Adding to cart cancelled!",
            text: "The product addition has been cancelled.",
            icon: "success"
        });
    }
      })
    })  




    deleteButton.forEach(el =>{
        el.addEventListener('click', async function() {
          
            var productid = el.dataset.idproduct;
           
          url=`/deleteWishListItem?productId=${productid}`
          const result = await fetch(url)
          const data = await result.json()
          console.log(data.message);
          if(data.message){
           
            Swal.fire({
                title: "Item Deleted Successfully ",
                text: "You can Place another order in cart!",
                icon: "success",
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "OK"
            })
        window.location.reload()
          
        } else {
            Swal.fire({
                title: "Deletion not Possible!",
                text: "The product deletion is not possible.",
                icon: "warning"
            });
        }
          })
        })  
    
    
    