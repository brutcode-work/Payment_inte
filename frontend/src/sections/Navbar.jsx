import React, { useState } from "react";

export const Navbar = ({
  handleSearchSubmit,
  cartItemsCount,
  currentUser,
  handleLogout,
  setDashboardView,
  isLoading,
}) => {
  const [searchVal, setSearchVal] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearchSubmit(searchVal);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div
          className="navbar-logo"
          onClick={() => setDashboardView("store")}
        >
          Need<span>.</span>
        </div>

        {/* Top Search bar */}
        <form className="navbar-search-form" onSubmit={onSubmit}>
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search product/item..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <button type="submit" className="navbar-search-btn">
            Search
          </button>
        </form>

        {/* Right Side Controls */}
        <div className="navbar-actions">
          {/* Cart Icon with badge count */}
          <button
            className="navbar-cart-trigger"
            onClick={() => setDashboardView("cart")}
            title="View Cart"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
              {currentUser?.name
                ? currentUser.name.charAt(0).toUpperCase()
                : "U"}
            </div>
            <span className="navbar-username">{currentUser?.name}</span>
          </div>

          <button
            className="navbar-logout-btn"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? (
              <div
                className="spinner"
                style={{ width: 12, height: 12 }}
              ></div>
            ) : (
              "Logout"
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
