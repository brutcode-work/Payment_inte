import React from "react";

export const LoginView = ({
  loginForm,
  handleLoginChange,
  handleLoginSubmit,
  isLoading,
  onNavigateRegister,
}) => {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">PayAuth</div>
          <p className="auth-subtitle">
            Sign in to your e-commerce profile
          </p>
        </div>

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email or Mobile
            </label>
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
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
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
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <a
            href="#register"
            className="auth-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigateRegister();
            }}
          >
            Register here
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
