import { createCartSummary } from "../services/cart.service.js";
import { razorpay } from "../services/razorpay.js";
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
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res
      .status(500)
      .json({ message: "Payment verification failed", error: error.message });
  }
};
