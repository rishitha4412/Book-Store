import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser && savedUser !== 'undefined') {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error("Stale session detected, clearing storage:", err);
      localStorage.removeItem('auth_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!email || !password) {
      toast.error('Please enter both email and password');
      setLoading(false);
      return false;
    }

    // Realistic Mock Verification
    const isMockAdmin = email.toLowerCase() === 'admin@bookstore.com';
    
    const loggedUser = {
      id: isMockAdmin ? 'admin-1' : 'user-1',
      name: isMockAdmin ? 'System Administrator' : 'Jane Doe',
      email: email.toLowerCase(),
      role: isMockAdmin ? 'admin' : 'customer',
      avatar: isMockAdmin 
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' 
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      createdAt: '2026-01-15'
    };

    setUser(loggedUser);
    localStorage.setItem('auth_user', JSON.stringify(loggedUser));
    toast.success(`Welcome back, ${loggedUser.name}!`);
    setLoading(false);
    return true;
  };

  const register = async (name, email, password) => {
    setLoading(true);
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!name || !email || !password) {
      toast.error('All fields are required');
      setLoading(false);
      return false;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUser(newUser);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    toast.success(`Account created successfully! Welcome, ${name}.`);
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    toast.success('Successfully logged out.');
  };

  const updateProfile = async (updatedData) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const updatedUser = {
      ...user,
      ...updatedData
    };
    setUser(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    toast.success('Profile updated successfully!');
    setLoading(false);
    return true;
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
