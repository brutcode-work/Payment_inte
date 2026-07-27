import { Router } from "express";
const router =  Router()

router.post("/create-order",(req,res) => {
    const {cartId} = req.body
})

export default router
