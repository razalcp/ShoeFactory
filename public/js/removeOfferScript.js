
async function removeOffer(productId){
 console.log("productId = "+ productId);

 url = `/admin/removeProductOffer?productId=${productId}`;

 const result = await fetch(url)
 const data = await result.json();

 if (data.status==true) {
    window.location.reload()
}else{
    console.log(data.status);
}

}