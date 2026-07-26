import express from "express";
import {
  addToCartController,
  getCartController,
  updateCartController,
  removeFromCartController,
  clearCartController
} from "../controllers/cart.controller.js";
import { verifyToken } from "../utils/verifyingSignature.js";

const cartRouter = express.Router();

// Get logged in user's cart
cartRouter.get("/", verifyToken, getCartController);

// Add product to cart
cartRouter.post("/add", verifyToken, addToCartController);

// Update product quantity in cart
cartRouter.put("/update", verifyToken, updateCartController);

// Remove product from cart
cartRouter.delete("/remove", verifyToken, removeFromCartController);

// Clear entire cart
cartRouter.delete("/clear", verifyToken, clearCartController);

export default cartRouter;
