import React from "react";
import OrderReceiptInvoice from "../features/order/OrderReceiptInvoice";

export const OrderSuccessSection = ({ lastOrderDetails, setDashboardView }) => {
  if (!lastOrderDetails) return null;

  return (
    <div className="success-page-card">
      <div className="success-badge-icon">✓</div>
      <h2 className="success-title">Order Confirmed!</h2>
      <p className="success-subtitle">
        Thank you for your checkout! Your order has been placed in our Sandbox
        environment.
      </p>

      {/* Receipt invoice card */}
      <OrderReceiptInvoice lastOrderDetails={lastOrderDetails} />

      <button
        className="cart-continue-shopping-btn"
        onClick={() => setDashboardView("store")}
        style={{
          width: "100%",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        Continue Shopping &rarr;
      </button>
    </div>
  );
};

export default OrderSuccessSection;
