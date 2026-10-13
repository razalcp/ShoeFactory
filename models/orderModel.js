const mongoose=require('mongoose')

const orerSchema = new mongoose.Schema({
    orderId:{
        type:Number,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    address:[
        { uname:{
             type:String,
             required:true
         },
         mobile:{
             type:Number,
             required:true
         },
         address:{
             type:String,
             required:true
         },
         locality:{
             type:String,
             required:true
         },
         city:{
             type:String,
             required:true
         },
         pincode:{
             type:Number,
             required:true
         },
         state:{
             type:String,
             required:true
         }
     
     
     }
     ],
     products:[{
        product_id:{type:mongoose.Schema.Types.ObjectId,ref:'product',required:true},
        variantId:{type:mongoose.Schema.Types.ObjectId,required:true},
        qty:{
            type:Number,
            required:true
        },
        status:{
            type:String,
            default:"Processing"
        }
     }],

     totalPrice:Number,

     paymentMethord:{
        type:String,
        required:true
       
     },
     paymentStatus:{
        type:String,
        required:true,
        default:"Payment not received"
     },
     createdAt: {
        type:Date,
        default: Date.now
     }
})

const orderModel = mongoose.model("order",orerSchema);

// Enable strict population to work correctly
orderModel.schema.set('strictPopulate', false);

module.exports = orderModel;