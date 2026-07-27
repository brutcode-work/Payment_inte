import dotenv from "dotenv";
dotenv.config();

export const ENV_CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
};
