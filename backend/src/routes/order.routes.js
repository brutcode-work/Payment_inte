import { Router } from "express";
import { createOrder, verify } from "../controllers/order.controller.js";
import protect from "../middleware/protect.js";

const router = Router();

router.use(protect);

router.post("/create-order", createOrder);
router.post("/verify", verify);

export default router;
