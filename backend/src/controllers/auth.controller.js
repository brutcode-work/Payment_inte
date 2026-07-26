import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const registerController = async (req,res) =>{
    try {
        const {name,email,password,mobile} = req.body;
        const isUserExists = await userModel.findOne({
            $or:[{email},{mobile}]
        })
        if(isUserExists){
            return res.status(400).json({message:"User already exists"})
        }

        const hash = await bcrypt.hash(password,10);

        const user = await userModel.create({
            name,
            email,
            password:hash,
            mobile
        })

        const token = jwt.sign({_id:user._id},"nkbbwbwob",{expiresIn:"1d"})

        res.cookie("token",token,{httpOnly:true,secure:true})

        res.status(200).json({message:"User registered successfully",user:{
            name:user.name,
            email:user.email,
            mobile:user.mobile,
        }})
        
    } catch (error) {
        console.error("Error in user registration",error)
    }
}

const loginController = async(req,res)=>{
    try {
        const {email,password,mobile} = req.body;

        const user = await userModel.findOne({
            $or:[{email},{mobile}]
        })
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid password"})
        }
        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET || "nkbbwbwob",{expiresIn:"1d"})
        res.cookie("token",token,{httpOnly:true,secure:true})
        res.status(200).json({message:"User logged in successfully",user:{
            name:user.name,
            email:user.email,
            mobile:user.mobile,
        }})
        
    } catch (error) {
        console.error("Error in user login",error)
    }
}

const logoutController = async(req,res)=>{
    try {
        res.clearCookie("token")
        res.status(200).json({message:"User logged out successfully"})
    } catch (error) {
        console.error("Error in user logout",error)
    }
}

const userVerifyController = async(req,res)=>{
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId).select("-password");
        
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        
        res.status(200).json({message:"User verified successfully",user})
    } catch (error) {
        console.error("Error in user verification",error)
        res.status(500).json({message:"Error verifying user"})
    }
}

export {registerController,loginController,logoutController,userVerifyController}