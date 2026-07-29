import { createCartSummary } from "../services/cart.service.js";
import { razorpay } from "../services/razorpay.js";
import crypto from "crypto";
import { ENV_CONFIG } from "../config/env.js";
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const summary = await createCartSummary(userId);

    const razorpayOrder = await razorpay.orders.create({
      amount: Number(summary.grandtotal * 100),
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    razorpayOrder.keyId = process.env.RAZORPAY_KEY;
    console.log(razorpayOrder.keyId);

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      razorpayOrder: razorpayOrder,
    });
  } catch (error) {
    console.error(error);
  }
};

export const verify = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const userId = req.user._id;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", ENV_CONFIG.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
    console.log("expected-signature::-", expectedSignature);
    console.log("razorpay-signature::-", razorpay_signature);

    const isAuthentic = expectedSignature === razorpay_signature;
    if (!isAuthentic) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      },
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res
      .status(500)
      .json({ message: "Payment verification failed", error: error.message });
  }
};
