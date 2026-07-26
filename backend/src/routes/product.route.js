import express from "express";
import { addProductController, getAllProductsController } from "../controllers/product.controller.js";

const productRouter = express.Router();

productRouter.post("/add", addProductController)
productRouter.get("/all", getAllProductsController)

export default productRouter;