const Product = require('../models/productModel')


const deleteImage = async (req,res) => {
    const {productId,imgName} = req.query
    const result = await Product.updateOne({_id:productId},{$pull:{imageurl:imgName}})
    res.json({message:"Deleted Successfully"})
}





module.exports ={deleteImage}