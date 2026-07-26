const API_BASE_URL = 'http://localhost:3000/api/auth';

/**
 * Handle API response
 */
async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

export const authService = {
  /**
   * Register a new user
   * @param {Object} userData - { name, email, password, mobile }
   */
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  /**
   * Log in an existing user
   * @param {string} emailOrMobile - Email address or mobile number
   * @param {string} password - Password
   */
  async login(emailOrMobile, password) {
    // Send emailOrMobile as both email and mobile so the backend $or query matches either
    const body = {
      email: emailOrMobile,
      mobile: emailOrMobile,
      password: password
    };

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  /**
   * Log out current user
   */
  async logout() {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  /**
   * Fetch all products
   */
  async getProducts() {
    const response = await fetch('http://localhost:3000/api/products/all', {
      method: 'GET',
    });
    return handleResponse(response);
  }
};
