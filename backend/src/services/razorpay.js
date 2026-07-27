import Razorpay from "razorpay";
import { ENV_CONFIG } from "../config/env.js";

export const razorpay = new Razorpay({
  key_id: ENV_CONFIG.RAZORPAY_KEY_ID,
  key_secret: ENV_CONFIG.RAZORPAY_KEY_SECRET,
});
