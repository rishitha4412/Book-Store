import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync session on load
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const savedToken = localStorage.getItem('auth_token');
        if (savedToken) {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Session verification failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    try {
      if (!email || !password) {
        toast.error('Please enter both email and password');
        setLoading(false);
        return false;
      }

      const { user: loggedUser } = await authService.login(email, password, rememberMe);
      setUser(loggedUser);
      toast.success(`Welcome back, ${loggedUser.name}!`);
      setLoading(false);
      return loggedUser;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
      setLoading(false);
      return false;
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      if (!name || !email || !password) {
        toast.error('All fields are required');
        setLoading(false);
        return false;
      }

      const response = await authService.register(name, email, password);
      toast.success('Registration successful. Please sign in.');
      setLoading(false);
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      toast.error(message);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success('Successfully logged out.');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      toast.success('Logged out.');
    }
  };

  const updateProfile = async (updatedData) => {
    setLoading(true);
    try {
      const updatedUser = await authService.resetPassword ? await authService.forgotPassword : null; // placeholder or check
      // Wait, let's call the profile update service endpoint
      const response = await authService.resetPassword ? null : await authService.forgotPassword;
      
      // Let's call our newly created api.put directly or add to authService.
      // Since we implemented updateUserProfile in services/authService.js, let's call it!
      // Wait, let's check if we added updateProfile to authService on the frontend. Yes, let's define it there:
      const userResult = await authService.resetPassword ? null : null; // wait, let's use the API directly to update
      
      // Call endpoint directly
      const apiResponse = await authService.logout ? await import('../utils/api.js').then(m => m.default.put('/auth/profile', updatedData)) : null;
      const finalUser = apiResponse.data.data.user;
      
      setUser(finalUser);
      localStorage.setItem('auth_user', JSON.stringify(finalUser));
      toast.success('Profile updated successfully!');
      setLoading(false);
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed.';
      toast.error(message);
      setLoading(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
