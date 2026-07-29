import { createCartSummary } from "../services/cart.service.js";
import { razorpay } from "../services/razorpay.js";
import crypto from "crypto";
import { ENV_CONFIG } from "../config/env.js";
import cartModel from "../models/cart.model.js";
import orderModel from "../models/order.model.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user cart with populated products for snapshot
    const cart = await cartModel.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const summary = await createCartSummary(userId);

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(summary.grandtotal * 100),
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    razorpayOrder.keyId = process.env.RAZORPAY_KEY || ENV_CONFIG.RAZORPAY_KEY_ID;

    // Build order items snapshot from cart
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      color: item.color || "",
    }));

    // Create Pending Order record in MongoDB
    await orderModel.create({
      user: userId,
      items: orderItems,
      totalAmount: summary.grandtotal,
      paymentMethod: "Razorpay",
      paymentStatus: "Pending",
      orderStatus: "Pending",
      razorpayOrderId: razorpayOrder.id,
    });

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      razorpayOrder: razorpayOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
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

    const isAuthentic = expectedSignature === razorpay_signature;
    if (!isAuthentic) {
      await orderModel.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { paymentStatus: "Failed", orderStatus: "Cancelled" }
      );

      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    // 1. Update Order in DB to Paid & Confirmed
    const updatedOrder = await orderModel.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        paymentStatus: "Paid",
        orderStatus: "Confirmed",
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    // 2. Clear Cart in DB AFTER payment verification succeeds
    await cartModel.findOneAndUpdate({ user: userId }, { items: [] });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order: updatedOrder,
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

