import React from "react";

export const CartSummaryPanel = ({
  cartSubtotal,
  cartTax,
  cartTotal,
  checkoutCart,
}) => {
  return (
    <div className="cart-summary-panel">
      <h3 className="cart-summary-title">Order Summary</h3>

      <div className="invoice-row">
        <span>Subtotal:</span>
        <span className="invoice-val">₹{cartSubtotal.toFixed(2)}</span>
      </div>

      <div className="invoice-row">
        <span>Shipping:</span>
        <span
          className="invoice-val"
          style={{ color: "var(--success)", fontWeight: 600 }}
        >
          FREE
        </span>
      </div>

      <div className="invoice-row">
        <span>GST Tax (18%):</span>
        <span className="invoice-val">₹{cartTax.toFixed(2)}</span>
      </div>

      {/* Grand Total */}
      <div className="invoice-row total-row">
        <span>Grand Total:</span>
        <span className="invoice-val highlight">
          ₹{cartTotal.toFixed(2)}
        </span>
      </div>

      {/* Place Order Checkout Button */}
      <button className="place-order-btn" onClick={checkoutCart}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        <span>Place Order & Pay</span>
      </button>
    </div>
  );
};

export default CartSummaryPanel;
