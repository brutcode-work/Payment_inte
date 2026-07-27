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
