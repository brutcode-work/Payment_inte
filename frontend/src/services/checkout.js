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
    throw new Error(
      "Razorpay SDK failed to load. Please check your network connection.",
    );
  }

  const { data } = await axiosInstance.post("/order/create-order");

  if (!data?.razorpayOrder) {
    throw new Error("Failed to create order on server.");
  }

  const { id, amount, currency } = data.razorpayOrder;

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY,
    amount: amount,
    currency: currency || "INR",
    name: "Payment Integration Store",
    description: "Order Payment",
    order_id: id,
    handler: async (response) => {
      try {
        const verifyRes = await axiosInstance.post("/order/verify", {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });

        if (verifyRes.data?.success) {
          if (onSuccess) {
            onSuccess(verifyRes.data, response);
          }
        } else {
          alert("Payment verification failed. Please contact support.");
        }
      } catch (error) {
        console.error("Error during payment verification:", error);
        alert(
          "Payment verification failed: " +
            (error.response?.data?.message || error.message),
        );
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
