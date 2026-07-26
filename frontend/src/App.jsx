import React, { useState, useEffect } from 'react';
import { authService } from './services/authService';
import { cartService } from './services/cartService';

function App() {
  // Navigation & Authentication State
  const [currentPage, setCurrentPage] = useState('login'); // 'login' | 'register' | 'dashboard'
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // E-Commerce Sub-Navigation State (Active when logged in)
  const [dashboardView, setDashboardView] = useState('store'); // 'store' | 'cart' | 'success'
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  // Products & Cart State
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [balance, setBalance] = useState(500.00); // Sandbox balance in INR
  const [transactions, setTransactions] = useState([
    { title: "Initial Sandbox Top-Up", date: "July 26, 2026 • 12:44 PM", amount: 500.00 }
  ]);

  // Search & Filtering State
  const [searchVal, setSearchVal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 100; // Show all products on one page

  // Toast Notification State
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  // Form Fields State - Login
  const [loginForm, setLoginForm] = useState({ emailOrMobile: '', password: '' });

  // Form Fields State - Register
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  // Check if user is already logged in (local state persistence)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        setCurrentPage('dashboard');
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Fetch products and cart from backend when user accesses dashboard
  useEffect(() => {
    if (currentPage === 'dashboard' && currentUser) {
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
      showToast('Failed to fetch store products: ' + error.message, 'error');
    }
  };

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
      if (response && response.cart && Array.isArray(response.cart.items)) {
        const validItems = response.cart.items.filter(item => item.product != null);
        setCart(validItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Helper to trigger Toast Notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
  };

  // Auto-hide toast
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // Form Input Change Handlers
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Login Handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.emailOrMobile.trim() || !loginForm.password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login(loginForm.emailOrMobile, loginForm.password);
      setCurrentUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      showToast(response.message || 'Logged in successfully!');
      setCurrentPage('dashboard');
      setDashboardView('store');
      setLoginForm({ emailOrMobile: '', password: '' }); // reset form
    } catch (error) {
      showToast(error.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Register Handler
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const { name, email, mobile, password, confirmPassword } = registerForm;

    // Validation
    if (!name.trim() || !email.trim() || !mobile.trim() || !password) {
      showToast('All fields are required', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    // Basic mobile validation (must contain numbers)
    const mobileRegex = /^[0-9+\-\s()]{10,15}$/;
    if (!mobileRegex.test(mobile)) {
      showToast('Please enter a valid mobile number (10-15 digits)', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.register({ name, email, mobile, password });
      setCurrentUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      showToast(response.message || 'Registration successful!');
      setCurrentPage('dashboard');
      setDashboardView('store');
      setRegisterForm({ name: '', email: '', mobile: '', password: '', confirmPassword: '' }); // reset form
    } catch (error) {
      showToast(error.message || 'Registration failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      showToast('Logged out successfully!');
    } catch (error) {
      showToast('Logged out locally.', 'error');
    } finally {
      setCurrentUser(null);
      setCart([]); // Clear cart on logout
      setDashboardView('store');
      localStorage.removeItem('user');
      setCurrentPage('login');
      setIsLoading(false);
    }
  };

  // --- Shopping Cart Helper Functions ---
  const addToCart = async (product, color) => {
    try {
      await cartService.addToCart(product._id, 1, color);
      await fetchCart();
      showToast(`Added "${product.name}" to cart!`);
    } catch (error) {
      showToast('Failed to add to cart: ' + error.message, 'error');
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
      showToast('Failed to update cart: ' + error.message, 'error');
    }
  };

  const removeFromCart = async (productId, color) => {
    try {
      await cartService.removeFromCart(productId, color);
      await fetchCart();
      showToast('Item removed from cart');
    } catch (error) {
      showToast('Failed to remove item: ' + error.message, 'error');
    }
  };

  // E-Commerce Checkout flow: Subtotal + Taxes (18% GST)
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const cartTax = cartSubtotal * 0.18;
  const cartTotal = cartSubtotal + cartTax;

  const checkoutCart = async () => {
    if (cart.length === 0) return;

    if (balance < cartTotal) {
      showToast('Insufficient sandbox balance! Add funds to complete checkout.', 'error');
      return;
    }

    setBalance(prev => prev - cartTotal);
    
    // Format timestamp
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
                    ' • ' + 
                    now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Generate random Order ID
    const randomOrderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    // Save order details for success screen
    const orderDetails = {
      orderId: randomOrderId,
      items: [...cart],
      subtotal: cartSubtotal,
      tax: cartTax,
      total: cartTotal,
      date: dateStr
    };
    setLastOrderDetails(orderDetails);

    // Log transaction in sandbox ledger
    const itemSummaries = cart.map(item => `${item.product?.name || 'Product'} (x${item.quantity})`).join(', ');
    const newTx = {
      title: `Checkout: Order ${randomOrderId} - ${itemSummaries}`,
      date: dateStr,
      amount: -cartTotal
    };
    setTransactions(prev => [newTx, ...prev]);

    // Clear cart in backend & frontend, route to success page
    try {
      await cartService.clearCart();
    } catch (error) {
      console.error('Error clearing backend cart:', error);
    }
    setCart([]);
    setDashboardView('success');
    showToast(`Order ${randomOrderId} placed successfully!`);
  };

  // Direct checkout option: adds single item to cart and forwards directly to checkout
  const buyNow = async (product) => {
    try {
      await cartService.addToCart(product._id, 1);
      await fetchCart();
      setDashboardView('cart');
      showToast(`Staged "${product.name}" for instant checkout below.`);
    } catch (error) {
      showToast('Failed to process buy now: ' + error.message, 'error');
    }
  };

  const addSandboxFunds = () => {
    setBalance(prev => prev + 100);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
                    ' • ' + 
                    now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setTransactions(prev => [{
      title: "Sandbox Top-Up Bonus",
      date: dateStr,
      amount: 100.00
    }, ...prev]);
    showToast('Credited ₹100.00 to your Sandbox balance!');
  };

  // Search Filter Handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchVal);
    setDashboardView('store'); // Force navigating to store catalog on search
    setCurrentPageNum(1); // Reset to first page
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPageNum(1); // Reset to first page
  };

  // --- Filtering & Slicing Products ---
  const categoriesList = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery.trim() === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPageNum - 1) * itemsPerPage,
    currentPageNum * itemsPerPage
  );

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-layout-wrapper">
      {/* Toast Alert */}
      {toast.visible && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Auth - Login Page */}
      {currentPage === 'login' && (
        <div className="auth-wrapper">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-logo">PayAuth</div>
              <p className="auth-subtitle">Sign in to your e-commerce profile</p>
            </div>
            
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email or Mobile</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="login-email"
                    name="emailOrMobile"
                    className="form-input"
                    placeholder="Enter email or mobile number"
                    value={loginForm.emailOrMobile}
                    onChange={handleLoginChange}
                    disabled={isLoading}
                    required
                  />
                  <div className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="login-password">Password</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    disabled={isLoading}
                    required
                  />
                  <div className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <span>Log In</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              Don't have an account? 
              <a href="#register" className="auth-link" onClick={(e) => { e.preventDefault(); setCurrentPage('register'); }}>
                Register here
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Auth - Register Page */}
      {currentPage === 'register' && (
        <div className="auth-wrapper">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-logo">PayAuth</div>
              <p className="auth-subtitle">Create an account to start shopping</p>
            </div>
            
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="register-name">Full Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="register-name"
                    name="name"
                    className="form-input"
                    placeholder="John Doe"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    disabled={isLoading}
                    required
                  />
                  <div className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-email">Email Address</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="register-email"
                    name="email"
                    className="form-input"
                    placeholder="john@example.com"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    disabled={isLoading}
                    required
                  />
                  <div className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-mobile">Mobile Number</label>
                <div className="input-wrapper">
                  <input
                    type="tel"
                    id="register-mobile"
                    name="mobile"
                    className="form-input"
                    placeholder="+1234567890"
                    value={registerForm.mobile}
                    onChange={handleRegisterChange}
                    disabled={isLoading}
                    required
                  />
                  <div className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-password">Password</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    id="register-password"
                    name="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    disabled={isLoading}
                    required
                  />
                  <div className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-confirm">Confirm Password</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    id="register-confirm"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="••••••••"
                    value={registerForm.confirmPassword}
                    onChange={handleRegisterChange}
                    disabled={isLoading}
                    required
                  />
                  <div className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <span>Create Account</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              Already have an account? 
              <a href="#login" className="auth-link" onClick={(e) => { e.preventDefault(); setCurrentPage('login'); }}>
                Log in here
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main E-Commerce Application Layout (Logged In) */}
      {currentPage === 'dashboard' && currentUser && (
        <>
          {/* E-Commerce Sticky Navigation Bar */}
          <nav className="navbar">
            <div className="navbar-container">
              {/* Brand Logo */}
              <div className="navbar-logo" onClick={() => setDashboardView('store')}>
                Need<span>.</span>
              </div>

              {/* Top Search bar */}
              <form className="navbar-search-form" onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  className="navbar-search-input"
                  placeholder="Search product/item..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                />
                <button type="submit" className="navbar-search-btn">Search</button>
              </form>

              {/* Right Side Controls */}
              <div className="navbar-actions">
                {/* Cart Icon with badge count */}
                <button className="navbar-cart-trigger" onClick={() => setDashboardView('cart')} title="View Cart">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  {cartItemsCount > 0 && (
                    <span className="navbar-cart-badge">{cartItemsCount}</span>
                  )}
                </button>

                {/* Avatar and Logout */}
                <div className="navbar-user-info">
                  <div className="navbar-avatar">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="navbar-username">{currentUser.name}</span>
                </div>
                
                <button className="navbar-logout-btn" onClick={handleLogout} disabled={isLoading}>
                  {isLoading ? <div className="spinner" style={{ width: 12, height: 12 }}></div> : 'Logout'}
                </button>
              </div>
            </div>
          </nav>

          {/* Main content viewport */}
          <main className="dashboard-content-wrapper">
            
            {/* 1. STORE VIEW (Catalog Listing) */}
            {dashboardView === 'store' && (
              <div className="store-catalog-wrapper">
                
                {/* Mockup Title header */}
                <div className="store-header-container">
                  <div className="store-mockup-title">
                    <span className="title-bold">Bestselling</span>
                    <span className="title-star">✧</span>
                    <span className="title-serif">Products</span>
                  </div>
                </div>

                {/* Body Layout: Categories sidebar + product grid */}
                <div className="store-body-layout">
                  {/* Category Sidebar */}
                  <aside className="store-sidebar">
                    {categoriesList.map((category) => (
                      <button
                        key={category}
                        className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => handleCategorySelect(category)}
                      >
                        <span className="category-bullet"></span>
                        <span>{category}</span>
                      </button>
                    ))}
                  </aside>

                  {/* Main Grid area */}
                  <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    {products.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-sub)' }}>
                        <div className="spinner" style={{ margin: '0 auto 10px auto', borderTopColor: 'var(--primary)', borderLeftColor: 'var(--border-color)' }}></div>
                        <p>Loading items...</p>
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-sub)' }}>
                        <p>No products found matching "{searchQuery}".</p>
                      </div>
                    ) : (
                      <>
                        {/* 3-Column layout */}
                        <div className="products-grid">
                          {paginatedProducts.map((product) => (
                            <div key={product._id} className="product-card">
                              
                              {/* Gray Backdrop for Image */}
                              <div className="product-img-box">
                                {product.category && <div className="product-category-tag">{product.category}</div>}
                                <img src={product.image} className="product-img" alt={product.name} />
                              </div>

                              {/* Details below */}
                              <div className="product-info">
                                <div className="product-title">{product.name}</div>
                                
                                <div className="product-meta-row">
                                  {/* Star score */}
                                  <div className="product-rating">
                                    <span className="star-icon">★</span>
                                    <span>{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
                                    <span>({product.reviewsCount || '100'} Reviews)</span>
                                  </div>
                                  
                                  {/* Price */}
                                  <div className="product-price">₹{product.price.toFixed(2)}</div>
                                </div>

                                {/* Stock Level indicator */}
                                <div style={{ fontSize: '11px', color: product.stock < 20 ? 'var(--error)' : 'var(--text-sub)', fontWeight: 600, marginTop: '2px' }}>
                                  {product.stock < 20 ? `Only ${product.stock} items left!` : `In Stock: ${product.stock}`}
                                </div>

                                {/* Double buttons */}
                                <div className="product-buttons">
                                  <button className="btn-add-cart" onClick={() => addToCart(product)}>
                                    Add to Cart
                                  </button>
                                  <button className="btn-buy-now" onClick={() => buyNow(product)}>
                                    Buy Now
                                  </button>
                                </div>
                              </div>

                            </div>
                          ))}
                        </div>

                        {/* Bottom Pagination */}
                        {totalPages > 1 && (
                          <div className="pagination-row">
                            <button
                              className="pagination-arrow"
                              disabled={currentPageNum === 1}
                              onClick={() => setCurrentPageNum(prev => prev - 1)}
                            >
                              &larr; Previous
                            </button>

                            {Array.from({ length: totalPages }).map((_, idx) => (
                              <button
                                key={idx + 1}
                                className={`pagination-number ${currentPageNum === idx + 1 ? 'active' : ''}`}
                                onClick={() => setCurrentPageNum(idx + 1)}
                              >
                                {idx + 1}
                              </button>
                            ))}

                            <button
                              className="pagination-arrow"
                              disabled={currentPageNum === totalPages}
                              onClick={() => setCurrentPageNum(prev => prev + 1)}
                            >
                              Next &rarr;
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* 2. CART VIEW (Dedicated Cart & Checkout Page) */}
            {dashboardView === 'cart' && (
              <div className="cart-page-layout">
                {/* Left Side: Items detailed list */}
                <div className="cart-items-panel">
                  <h3 className="cart-panel-title">
                    <span>Your Shopping Cart</span>
                    <span className="cart-panel-item-count">{cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'}</span>
                  </h3>

                  {cart.length === 0 ? (
                    <div className="cart-page-empty">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-sub)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      <p>Your shopping cart is currently empty.</p>
                      <button className="cart-continue-shopping-btn" onClick={() => setDashboardView('store')}>
                        &larr; Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="cart-items-grid">
                      {cart.map((item) => (
                        <div key={item.product._id} className="cart-page-item">
                          
                          {/* Image Box */}
                          <div className="cart-page-img-box">
                            <img src={item.product.image} className="cart-page-img" alt={item.product.name} />
                          </div>

                          {/* Details details */}
                          <div className="cart-page-details">
                            <span className="cart-page-category">{item.product.category || item.product.tag || 'Other'}</span>
                            <div className="cart-page-name">{item.product.name}</div>
                            
                            <div className="cart-page-price-qty-row">
                              <div className="cart-page-controls">
                                <button className="cart-page-qty-btn" onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}>-</button>
                                <span className="cart-page-qty-val">{item.quantity}</span>
                                <button className="cart-page-qty-btn" onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}>+</button>
                              </div>

                              <div className="cart-page-price-subtotal">
                                <span className="cart-page-unit-price">₹{item.product.price.toFixed(2)} each</span>
                                <div className="cart-page-total-price">₹{(item.product.price * item.quantity).toFixed(2)}</div>
                              </div>
                            </div>
                          </div>

                          {/* Delete Item */}
                          <button className="cart-page-remove-btn" onClick={() => removeFromCart(item.product._id)} title="Remove item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      ))}

                      <div style={{ marginTop: '10px' }}>
                        <button className="cart-continue-shopping-btn" onClick={() => setDashboardView('store')}>
                          &larr; Add more products
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Invoice Summary */}
                {cart.length > 0 && (
                  <div className="cart-summary-panel">
                    <h3 className="cart-summary-title">Order Summary</h3>
                    
                    <div className="invoice-row">
                      <span>Subtotal:</span>
                      <span className="invoice-val">₹{cartSubtotal.toFixed(2)}</span>
                    </div>

                    <div className="invoice-row">
                      <span>Shipping:</span>
                      <span className="invoice-val" style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
                    </div>

                    <div className="invoice-row">
                      <span>GST Tax (18%):</span>
                      <span className="invoice-val">₹{cartTax.toFixed(2)}</span>
                    </div>

                    {/* Grand Total */}
                    <div className="invoice-row total-row">
                      <span>Grand Total:</span>
                      <span className="invoice-val highlight">₹{cartTotal.toFixed(2)}</span>
                    </div>



                    {/* Place Order Checkout Button */}
                    <button className="place-order-btn" onClick={checkoutCart}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      <span>Place Order & Pay</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. ORDER SUCCESS VIEW */}
            {dashboardView === 'success' && lastOrderDetails && (
              <div className="success-page-card">
                <div className="success-badge-icon">✓</div>
                <h2 className="success-title">Order Confirmed!</h2>
                <p className="success-subtitle">
                  Thank you for your checkout! Your order has been placed in our Sandbox environment.
                </p>

                {/* Receipt invoice card */}
                <div className="receipt-box">
                  <div className="receipt-header">Order Invoice Details</div>
                  
                  <div className="receipt-item">
                    <span style={{ color: 'var(--text-sub)' }}>Order ID:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{lastOrderDetails.orderId}</span>
                  </div>

                  <div className="receipt-item">
                    <span style={{ color: 'var(--text-sub)' }}>Date & Time:</span>
                    <span>{lastOrderDetails.date}</span>
                  </div>

                  <div className="receipt-item">
                    <span style={{ color: 'var(--text-sub)' }}>Payment Method:</span>
                    <span>Sandbox Developer Wallet</span>
                  </div>

                  <div style={{ margin: '6px 0', borderBottom: '1px solid var(--border-color)' }}></div>

                  {lastOrderDetails.items.map((item, idx) => (
                    <div key={idx} className="receipt-item" style={{ fontSize: '13px', color: 'var(--text-sub)' }}>
                      <span>{item.product.name} (x{item.quantity})</span>
                      <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}

                  <div style={{ margin: '6px 0', borderBottom: '1px solid var(--border-color)' }}></div>

                  <div className="receipt-item" style={{ fontSize: '13px', color: 'var(--text-sub)' }}>
                    <span>Subtotal:</span>
                    <span>₹{lastOrderDetails.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="receipt-item" style={{ fontSize: '13px', color: 'var(--text-sub)' }}>
                    <span>GST Tax (18%):</span>
                    <span>₹{lastOrderDetails.tax.toFixed(2)}</span>
                  </div>

                  <div className="receipt-footer">
                    <span>Amount Charged:</span>
                    <span style={{ color: 'var(--primary)' }}>₹{lastOrderDetails.total.toFixed(2)}</span>
                  </div>
                </div>



                <button className="cart-continue-shopping-btn" onClick={() => setDashboardView('store')} style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                  Continue Shopping &rarr;
                </button>
              </div>
            )}



          </main>
        </>
      )}
    </div>
  );
}

export default App;
