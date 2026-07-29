import orderModel from "../models/order.model.js";

export const createOrderService = async (userId) => {
  const order = await orderModel.create({
    user: userId,
  });
};
