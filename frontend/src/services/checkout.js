import axiosInstance from "../api/api";

export const handleCheckout = async () => {
  const { data } = await axiosInstance.post("/order/create-order");
  console.log(data);
  return data;
};
