import cartModel from "../models/cart.model.js";
import { calculateSum, calculateGst } from "../services/cart.service.js";

const buildCartSummary = async (userId) => {
  const subtotal = Number((await calculateSum(userId)) || 0);
  const gstAmount = Number(calculateGst(subtotal, 18).toFixed(2));
  const grandtotal = Number((subtotal + gstAmount).toFixed(2));

  return { subtotal, gstAmount, grandtotal };
};

// Add product to cart
export const addToCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1, color } = req.body;

    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      cart = await cartModel.create({
        user: userId,
        items: [{ product: productId, quantity, color }],
      });
    } else {
      const itemExist = cart.items.find(
        (item) => item.product.toString() === productId && item.color === color,
      );

      if (itemExist) {
        itemExist.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, color });
      }
      await cart.save();
    }

    const summary = await buildCartSummary(userId);

    res.status(200).json({ message: "Product added to cart", cart, ...summary });
  } catch (error) {
    console.error("Error adding to cart", error);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

// Get user cart
export const getCartController = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await cartModel
      .findOne({ user: userId })
      .populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const summary = await buildCartSummary(userId);

    res.status(200).json({
      message: "Cart retrieved successfully",
      cart,
      ...summary,
    });
  } catch (error) {
    console.error("Error getting cart", error);
    res.status(500).json({ message: "Error retrieving cart" });
  }
};

// Update cart item quantity
export const updateCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity, color } = req.body;

    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId && item.color === color,
    );

    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) =>
          !(item.product.toString() === productId && item.color === color),
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    const summary = await buildCartSummary(userId);

    res.status(200).json({
      message: "Cart updated successfully",
      cart,
      ...summary,
    });
  } catch (error) {
    console.error("Error updating cart", error);
    res.status(500).json({ message: "Error updating cart" });
  }
};

// Remove product from cart
export const removeFromCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, color } = req.body;

    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(item.product.toString() === productId && item.color === color),
    );

    await cart.save();
    const summary = await buildCartSummary(userId);

    res.status(200).json({
      message: "Product removed from cart",
      cart,
      ...summary,
    });
  } catch (error) {
    console.error("Error removing from cart", error);
    res.status(500).json({ message: "Error removing from cart" });
  }
};

// Clear entire cart
export const clearCartController = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await cartModel.findOneAndUpdate(
      { user: userId },
      { items: [] },
      { new: true },
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const summary = await buildCartSummary(userId);

    res.status(200).json({
      message: "Cart cleared successfully",
      cart,
      ...summary,
    });
  } catch (error) {
    console.error("Error clearing cart", error);
    res.status(500).json({ message: "Error clearing cart" });
  }
};
