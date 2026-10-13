const Product = require('../models/productModel')

const updateOffer = async(req,res) => {

    const{productId} = req.query
    const {offerValue} = req.query
    
    
    // Convert offerValue to number
    const numericOfferValue = parseFloat(offerValue)
    
    if (isNaN(numericOfferValue) || numericOfferValue < 0 || numericOfferValue > 100) {
        console.log('Error: Invalid offer value:', offerValue)
        return res.json({ status: false, error: 'Invalid offer value. Must be between 0 and 100.' })
    }
    
    const productd = await Product.findOne({_id:productId})
    
    
    if (!productd || !productd.variants || productd.variants.length === 0) {
        return res.json({ status: false, error: 'Product or variants not found' })
    }

    // Get the first variant's price for offer calculation
    let actualPrice = productd.variants[0].price
    let discountPrice = actualPrice - Math.floor((actualPrice * numericOfferValue / 100))

    const update = await Product.findOneAndUpdate(
        {_id:productId}, 
        {$set:{productOffer:numericOfferValue, discountPrice:discountPrice}},
        {new: true} // Return the updated document
    );
    
    if (update) {
        res.json({ status: true, updatedProduct: {productOffer: update.productOffer, discountPrice: update.discountPrice} })
    } else {
        res.json({ status: false, error: 'Database update failed' })
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
