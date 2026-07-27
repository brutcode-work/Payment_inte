import productModel from "../models/products.model.js";
import cartModel from "../models/cart.model.js";

export const calculateSum = async (userId) => {
  try {
    const cart = await cartModel.findOne({ user: userId });
    if (!cart) throw new Error("Cart not exist");

    let totalSum = 0;

    const items = cart.items;

    for (const item of items) {
      const product = await productModel.findById(item.product);
      if (!product) continue;

      totalSum += product.price * item.quantity;
    }

    return totalSum;
  } catch (error) {
    console.error(error);
  }
};

export const calculateGst = (amount, gstPercent) => {
  return amount * (gstPercent / 100);
};

export const createCartSummary = async (userId, gstPercent = 18) => {
  try {
    const subtotal = Number((await calculateSum(userId)) || 0);
    const gstAmount = Number(calculateGst(subtotal, gstPercent).toFixed(2));
    const grandtotal = Number((subtotal + gstAmount).toFixed(2));

    return { subtotal, gstAmount, grandtotal };
  } catch (err) {
    console.error("Error creating cart summary:", err);
    throw err;
  }
};

