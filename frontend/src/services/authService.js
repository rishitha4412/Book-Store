import api from '../utils/api.js';

export const authService = {
  // Login user and store token/user details in browser caching
  login: async (email, password, rememberMe = false) => {
    const response = await api.post('/auth/login', { email, password, rememberMe });
    const { token, user } = response.data.data;
    
    // Maintain local caching for components requiring instant synchronous profile states
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    return { token, user };
  },

  // Register a new customer
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  // Fetch current user details via session cookie
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      const { user } = response.data.data;
      localStorage.setItem('auth_user', JSON.stringify(user));
      return user;
    } catch (error) {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      return null;
    }
  },

  // Terminate user session
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('bookstore_cart');
    localStorage.removeItem('bookstore_wishlist');
    return true;
  },


  // Request password reset link
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password using token
  resetPassword: async (token, password) => {
    const response = await api.patch(`/auth/reset-password/${token}`, { password });
    return response.data;
  }
};
