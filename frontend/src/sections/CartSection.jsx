import React from "react";
import CartItemList from "../features/cart/CartItemList";
import CartSummaryPanel from "../features/cart/CartSummaryPanel";

export const CartSection = ({
  cart,
  cartItemsCount,
  updateCartQuantity,
  removeFromCart,
  cartSubtotal,
  cartTax,
  cartTotal,
  checkoutCart,
  setDashboardView,
}) => {
  return (
    <div className="cart-page-layout">
      {/* Left Side: Items detailed list */}
      <CartItemList
        cart={cart}
        cartItemsCount={cartItemsCount}
        updateCartQuantity={updateCartQuantity}
        removeFromCart={removeFromCart}
        setDashboardView={setDashboardView}
      />

      {/* Right Side: Invoice Summary */}
      {cart.length > 0 && (
        <CartSummaryPanel
          cartSubtotal={cartSubtotal}
          cartTax={cartTax}
          cartTotal={cartTotal}
          checkoutCart={checkoutCart}
        />
      )}
    </div>
  );
};

export default CartSection;
