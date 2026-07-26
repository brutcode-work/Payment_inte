import mongoose from "mongoose";
import {ENV_CONFIG} from "./env.js";
import seedProducts from "./seed.js";

const connectToDb = async()=>{
    try{
        await mongoose.connect(ENV_CONFIG.MONGODB_URI)
        console.log("database connected")
        await seedProducts();
    }catch(error){
        console.log(error)
    }
}

export default connectToDb;