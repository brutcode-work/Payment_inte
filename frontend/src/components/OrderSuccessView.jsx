import React from "react";

export const OrderSuccessView = ({ lastOrderDetails, setDashboardView }) => {
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
      <div className="receipt-box">
        <div className="receipt-header">Order Invoice Details</div>

        <div className="receipt-item">
          <span style={{ color: "var(--text-sub)" }}>Order ID:</span>
          <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
            {lastOrderDetails.orderId}
          </span>
        </div>

        <div className="receipt-item">
          <span style={{ color: "var(--text-sub)" }}>Date & Time:</span>
          <span>{lastOrderDetails.date}</span>
        </div>

        <div className="receipt-item">
          <span style={{ color: "var(--text-sub)" }}>Payment Method:</span>
          <span>Sandbox Developer Wallet</span>
        </div>

        <div
          style={{
            margin: "6px 0",
            borderBottom: "1px solid var(--border-color)",
          }}
        ></div>

        {lastOrderDetails.items.map((item, idx) => (
          <div
            key={idx}
            className="receipt-item"
            style={{ fontSize: "13px", color: "var(--text-sub)" }}
          >
            <span>
              {item.product?.name || "Product"} (x{item.quantity})
            </span>
            <span>
              ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}

        <div
          style={{
            margin: "6px 0",
            borderBottom: "1px solid var(--border-color)",
          }}
        ></div>

        <div
          className="receipt-item"
          style={{ fontSize: "13px", color: "var(--text-sub)" }}
        >
          <span>Subtotal:</span>
          <span>₹{lastOrderDetails.subtotal.toFixed(2)}</span>
        </div>

        <div
          className="receipt-item"
          style={{ fontSize: "13px", color: "var(--text-sub)" }}
        >
          <span>GST Tax (18%):</span>
          <span>₹{lastOrderDetails.tax.toFixed(2)}</span>
        </div>

        <div className="receipt-footer">
          <span>Amount Charged:</span>
          <span style={{ color: "var(--primary)" }}>
            ₹{lastOrderDetails.total.toFixed(2)}
          </span>
        </div>
      </div>

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

export default OrderSuccessView;
