import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    tag:{
        type:String
    },
    colors:{
        type:[String]
    },
    rating:{
        type:Number,
        default:5.0
    },
    reviewsCount:{
        type:String,
        default:"100"
    },
    category:{
        type:String
    },
    stock:{
        type:Number,
        default:10
    }
})

const productModel = mongoose.model("Product",productSchema)
export default productModel;