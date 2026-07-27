import React from "react";

export const CartItemList = ({
  cart,
  cartItemsCount,
  updateCartQuantity,
  removeFromCart,
  setDashboardView,
}) => {
  return (
    <div className="cart-items-panel">
      <h3 className="cart-panel-title">
        <span>Your Shopping Cart</span>
        <span className="cart-panel-item-count">
          {cartItemsCount} {cartItemsCount === 1 ? "item" : "items"}
        </span>
      </h3>

      {cart.length === 0 ? (
        <div className="cart-page-empty">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-sub)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <p>Your shopping cart is currently empty.</p>
          <button
            className="cart-continue-shopping-btn"
            onClick={() => setDashboardView("store")}
          >
            &larr; Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-items-grid">
          {cart.map((item) => (
            <div key={item.product._id} className="cart-page-item">
              {/* Image Box */}
              <div className="cart-page-img-box">
                <img
                  src={item.product.image}
                  className="cart-page-img"
                  alt={item.product.name}
                />
              </div>

              {/* Details */}
              <div className="cart-page-details">
                <span className="cart-page-category">
                  {item.product.category || item.product.tag || "Other"}
                </span>
                <div className="cart-page-name">{item.product.name}</div>

                <div className="cart-page-price-qty-row">
                  <div className="cart-page-controls">
                    <button
                      className="cart-page-qty-btn"
                      onClick={() =>
                        updateCartQuantity(
                          item.product._id,
                          item.quantity - 1
                        )
                      }
                    >
                      -
                    </button>
                    <span className="cart-page-qty-val">{item.quantity}</span>
                    <button
                      className="cart-page-qty-btn"
                      onClick={() =>
                        updateCartQuantity(
                          item.product._id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-page-price-subtotal">
                    <span className="cart-page-unit-price">
                      ₹{item.product.price.toFixed(2)} each
                    </span>
                    <div className="cart-page-total-price">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delete Item */}
              <button
                className="cart-page-remove-btn"
                onClick={() => removeFromCart(item.product._id)}
                title="Remove item"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))}

          <div style={{ marginTop: "10px" }}>
            <button
              className="cart-continue-shopping-btn"
              onClick={() => setDashboardView("store")}
            >
              &larr; Add more products
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItemList;
