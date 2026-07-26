const API_BASE_URL = 'http://localhost:3000/api/cart';

/**
 * Handle API response
 */
async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 404 && data.message === "Cart not found") {
      return { message: "Cart not found", cart: { items: [] } };
    }
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

export const cartService = {
  /**
   * Fetch current user's cart from backend
   */
  async getCart() {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Add a product to the cart
   * @param {string} productId 
   * @param {number} quantity 
   * @param {string} color 
   */
  async addToCart(productId, quantity = 1, color) {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ productId, quantity, color }),
    });
    return handleResponse(response);
  },

  /**
   * Update quantity of a product in the cart
   * @param {string} productId 
   * @param {number} quantity 
   * @param {string} color 
   */
  async updateCart(productId, quantity, color) {
    const response = await fetch(`${API_BASE_URL}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ productId, quantity, color }),
    });
    return handleResponse(response);
  },

  /**
   * Remove a product from the cart
   * @param {string} productId 
   * @param {string} color 
   */
  async removeFromCart(productId, color) {
    const response = await fetch(`${API_BASE_URL}/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ productId, color }),
    });
    return handleResponse(response);
  },

  /**
   * Clear the entire cart
   */
  async clearCart() {
    const response = await fetch(`${API_BASE_URL}/clear`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return handleResponse(response);
  }
};
