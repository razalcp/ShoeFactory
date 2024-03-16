



async function deleteImg(productId,imgName) {
   url=`http://localhost:3003/admin/deleteImage?productId=${productId}&imgName=${imgName}`
   
   const result = await fetch(url)
   const data = await result.json()
   if(data.message){
    window.location.reload();
   }
}