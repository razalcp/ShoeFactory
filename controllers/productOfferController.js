const Product = require('../models/productModel')

const updateOffer = async(req,res) => {

    const{productId} = req.query
    const {offerValue} =req.query
   
    const productd=await Product.findOne({_id:productId})
    

  let actualPrice = productd.price
  let discountPrice =actualPrice-Math.floor(( actualPrice*offerValue/100))


    const update = await Product.findOneAndUpdate({_id:productId},{$set:{productOffer:offerValue,discountPrice:discountPrice}});
    if (update) {
                                                                         
        res.json({ status: true})
    } else {
    res.json({ status: false})
}


}


const removeOffer = async (req,res) => {
    const {productId} = req.query;
    
    const updateOffer = await Product.findOneAndUpdate({_id:productId},{$set:{productOffer:0,discountPrice:0}})
    if(updateOffer) {
        res.json({status:true})
    } else {
        res.json({status:false});
    }
}


module.exports = {updateOffer,removeOffer}