import express from "express";
import { registerController, loginController, logoutController, userVerifyController } from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyingSignature.js";

const authRouter = express.Router();

authRouter.post("/register", registerController)
authRouter.post("/login", loginController)
authRouter.post("/logout", logoutController)
authRouter.get("/verify", verifyToken, userVerifyController)

export default authRouter;
