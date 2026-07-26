import mongoose from "mongoose";
import productModel from "../models/products.model.js";

const addProductController = async(req,res)=>{
    try {
        const {name,price,description,image} = req.body;
        const product = await productModel.create({
            name,
            price,
            description,
            image
        })
        res.status(200).json({message:"Product added successfully",product})
    } catch (error) {
        console.error("Error in adding product",error)
    }
}

const getAllProductsController = async(req,res)=>{
    try {
        const products = await productModel.find();
        res.status(200).json({message:"Products fetched successfully",products})
    } catch (error) {
        console.error("Error in fetching products",error)
    }
}



export {addProductController,getAllProductsController}
