const Brand= require('../models/brandModel')
const Product= require('../models/productModel')

const updateOffer = async(req,res) => {

    const{brandId} = req.query
    const {offerValue} =req.query

//    console.log(offerValue);
    // const brandData=await Product.findOne({_id:brandId})
    

//   let actualPrice = productd.price
//   let discountPrice =actualPrice-Math.floor(( actualPrice*offerValue/100))


    const update = await Brand.findOneAndUpdate({_id:brandId},{$set:{brandOffer:offerValue}});
    const products = await Product.find({brandId:brandId});
    for (const el of products) {
        await Product.findByIdAndUpdate({ _id: el._id }, { $set: { offerBrand: offerValue } });
    }
    

    if (update) {
                                                                         
        res.json({ status: true})
    } else {
    res.json({ status: false})
}


}


const removeOffer = async (req,res) => {
    const {brandId} = req.query;
    
    const updateOffer = await Brand.findOneAndUpdate({_id:brandId},{$set:{brandOffer:0}});
    const products = await Product.find({brandId:brandId});
    for (const el of products) {
        await Product.findByIdAndUpdate({ _id: el._id }, { $set: { offerBrand: 0 } });
    }
    if(updateOffer) {
        res.json({status:true})
    } else {
        res.json({status:false});
    }
}


module.exports = {updateOffer,removeOffer}