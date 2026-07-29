import React, { useState, useEffect } from "react";
import { authService } from "./services/authService";
import { cartService } from "./services/cartService";
import { handleCheckout } from "./services/checkout";

// Import Shared Components, Sections & Pages
import Toast from "./components/Toast";
import Navbar from "./sections/Navbar";
import AuthPage from "./pages/AuthPage";
import StorePage from "./pages/StorePage";
import CartPage from "./pages/CartPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";

function App() {
  // Navigation & Authentication State
  const [currentPage, setCurrentPage] = useState("login"); // 'login' | 'register' | 'dashboard'
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Dashboard Sub-View State ('store' | 'cart' | 'success')
  const [dashboardView, setDashboardView] = useState("store");
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  // Store & Cart Shared State
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    gstAmount: 0,
    grandtotal: 0,
  });
  const [balance, setBalance] = useState(500.0);

  // Search Filter State (passed to StorePage)
  const [searchQuery, setSearchQuery] = useState("");

  // Toast Alert Notification State
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  // Restore saved login session
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        setCurrentPage("dashboard");
      } catch (err) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Fetch products & cart when entering dashboard
  useEffect(() => {
    if (currentPage === "dashboard" && currentUser) {
      fetchProducts();
      fetchCart();
    }
  }, [currentPage, currentUser]);

  const fetchProducts = async () => {
    try {
      const response = await authService.getProducts();
      if (response && response.products) {
        setProducts(response.products);
      }
    } catch (error) {
      showToast("Failed to fetch store products: " + error.message, "error");
    }
  };

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
      if (response && response.cart && Array.isArray(response.cart.items)) {
        const validItems = response.cart.items.filter(
          (item) => item.product != null,
        );
        setCart(validItems);
        setCartSummary({
          subtotal: Number(response.subtotal || 0),
          gstAmount: Number(response.gstAmount || 0),
          grandtotal: Number(response.grandtotal || 0),
        });
      } else {
        setCart([]);
        setCartSummary({ subtotal: 0, gstAmount: 0, grandtotal: 0 });
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
      setCartSummary({ subtotal: 0, gstAmount: 0, grandtotal: 0 });
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
  };

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // Authentication Actions
  const handleLogin = async (emailOrMobile, password) => {
    if (!emailOrMobile.trim() || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login(emailOrMobile, password);
      setCurrentUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      showToast(response.message || "Logged in successfully!");
      setCurrentPage("dashboard");
      setDashboardView("store");
    } catch (error) {
      showToast(
        error.message || "Login failed. Please check your credentials.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async ({
    name,
    email,
    mobile,
    password,
    confirmPassword,
  }) => {
    if (!name.trim() || !email.trim() || !mobile.trim() || !password) {
      showToast("All fields are required", "error");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 characters long", "error");
      return;
    }

    const mobileRegex = /^[0-9+\-\s()]{10,15}$/;
    if (!mobileRegex.test(mobile)) {
      showToast("Please enter a valid mobile number (10-15 digits)", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.register({
        name,
        email,
        mobile,
        password,
      });
      setCurrentUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      showToast(response.message || "Registration successful!");
      setCurrentPage("dashboard");
      setDashboardView("store");
    } catch (error) {
      showToast(error.message || "Registration failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      showToast("Logged out successfully!");
    } catch (error) {
      showToast("Logged out locally.", "error");
    } finally {
      setCurrentUser(null);
      setCart([]);
      setDashboardView("store");
      localStorage.removeItem("user");
      setCurrentPage("login");
      setIsLoading(false);
    }
  };

  // Shopping Cart Actions
  const addToCart = async (product, color) => {
    try {
      await cartService.addToCart(product._id, 1, color);
      await fetchCart();
      showToast(`Added "${product.name}" to cart!`);
    } catch (error) {
      showToast("Failed to add to cart: " + error.message, "error");
    }
  };

  const updateCartQuantity = async (productId, newQuantity, color) => {
    try {
      if (newQuantity <= 0) {
        await cartService.removeFromCart(productId, color);
      } else {
        await cartService.updateCart(productId, newQuantity, color);
      }
      await fetchCart();
    } catch (error) {
      showToast("Failed to update cart: " + error.message, "error");
    }
  };

  const removeFromCart = async (productId, color) => {
    try {
      await cartService.removeFromCart(productId, color);
      await fetchCart();
      showToast("Item removed from cart");
    } catch (error) {
      showToast("Failed to remove item: " + error.message, "error");
    }
  };

  const cartSubtotal = cartSummary.subtotal;
  const cartTax = cartSummary.gstAmount;
  const cartTotal = cartSummary.grandtotal;

  const checkoutCart = async () => {
    if (cart.length === 0) return;

    if (balance < cartTotal) {
      showToast(
        "Insufficient sandbox balance! Add funds to complete checkout.",
        "error",
      );
      return;
    }

    let checkoutResponse;
    try {
      // Trigger order creation & await payment verification
      checkoutResponse = await handleCheckout();
      console.log("Checkout response:", checkoutResponse);
    } catch (error) {
      console.error("Error during checkout:", error);
      showToast(
        "Checkout not completed: " + (error.response?.data?.message || error.message),
        "error",
      );
      return;
    }

    // Payment has been verified successfully by backend, and backend has cleared DB cart
    setBalance((prev) => prev - cartTotal);

    const serverOrder = checkoutResponse?.verifyData?.order;
    const now = new Date();
    const dateStr =
      now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " • " +
      now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const orderId = serverOrder?.razorpayOrderId || "ORD-" + Math.floor(100000 + Math.random() * 900000);

    const orderDetails = {
      orderId: orderId,
      items: [...cart],
      subtotal: cartSubtotal,
      tax: cartTax,
      total: cartTotal,
      date: dateStr,
    };
    setLastOrderDetails(orderDetails);

    // Reset local frontend cart state (backend cart has already been cleared upon payment verification)
    setCart([]);
    setDashboardView("success");
    showToast(`Order ${orderId} placed successfully!`);
  };

  const buyNow = async (product) => {
    try {
      await cartService.addToCart(product._id, 1);
      await fetchCart();
      setDashboardView("cart");
      showToast(`Staged "${product.name}" for instant checkout below.`);
    } catch (error) {
      showToast("Failed to process buy now: " + error.message, "error");
    }
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    setDashboardView("store");
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-layout-wrapper">
      {/* Toast Alert */}
      <Toast toast={toast} />

      {/* Auth Pages (Login / Register) */}
      {(currentPage === "login" || currentPage === "register") && (
        <AuthPage
          authMode={currentPage}
          onLogin={handleLogin}
          onRegister={handleRegister}
          isLoading={isLoading}
          onSwitchMode={(mode) => setCurrentPage(mode)}
        />
      )}

      {/* Logged In Dashboard */}
      {currentPage === "dashboard" && currentUser && (
        <>
          <Navbar
            handleSearchSubmit={handleSearchSubmit}
            cartItemsCount={cartItemsCount}
            currentUser={currentUser}
            handleLogout={handleLogout}
            setDashboardView={setDashboardView}
            isLoading={isLoading}
          />

          <main className="dashboard-content-wrapper">
            {/* 1. STORE PAGE */}
            {dashboardView === "store" && (
              <StorePage
                products={products}
                searchQuery={searchQuery}
                addToCart={addToCart}
                buyNow={buyNow}
              />
            )}

            {/* 2. CART PAGE */}
            {dashboardView === "cart" && (
              <CartPage
                cart={cart}
                cartItemsCount={cartItemsCount}
                updateCartQuantity={updateCartQuantity}
                removeFromCart={removeFromCart}
                cartSubtotal={cartSubtotal}
                cartTax={cartTax}
                cartTotal={cartTotal}
                checkoutCart={checkoutCart}
                setDashboardView={setDashboardView}
              />
            )}

            {/* 3. ORDER SUCCESS PAGE */}
            {dashboardView === "success" && (
              <OrderSuccessPage
                lastOrderDetails={lastOrderDetails}
                setDashboardView={setDashboardView}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default App;
