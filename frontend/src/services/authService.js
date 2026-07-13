const simulateDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  login: async (email, password) => {
    await simulateDelay(800);
    // Simple verification helper
    const isAdmin = email.toLowerCase() === 'admin@bookstore.com';
    return {
      token: 'mock-jwt-token-xyz',
      user: {
        id: isAdmin ? 'admin-1' : 'user-1',
        name: isAdmin ? 'System Administrator' : 'Jane Doe',
        email: email.toLowerCase(),
        role: isAdmin ? 'admin' : 'customer',
        avatar: isAdmin 
          ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' 
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
    };
  },

  register: async (name, email, password) => {
    await simulateDelay(800);
    return {
      token: 'mock-jwt-token-xyz',
      user: {
        id: `user-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
    };
  },

  getCurrentUser: async () => {
    await simulateDelay(200);
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  }
};
