import axiosInstance from "../api/api";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const handleCheckout = async (onSuccess) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    throw new Error("Razorpay SDK failed to load. Please check your network connection.");
  }

  const { data } = await axiosInstance.post("/order/create-order");

  if (!data?.razorpayOrder) {
    throw new Error("Failed to create order on server.");
  }

  const { id, amount, currency, keyId } = data.razorpayOrder;

  const options = {
    key: keyId || import.meta.env.VITE_RAZORPAY_KEY,
    amount: amount,
    currency: currency || "INR",
    name: "Payment Integration Store",
    description: "Order Payment",
    order_id: id,
    handler: async (response) => {
      try {
        const verifyRes = await axiosInstance.post("/order/verify", response);
        if (onSuccess) {
          onSuccess(verifyRes.data, response);
        }
      } catch (error) {
        console.error("Error during payment verification:", error);
      }
    },
    theme: {
      color: "#000000",
    },
  };

  const razorpayInstance = new window.Razorpay(options);
  razorpayInstance.open();
};

export default handleCheckout;
