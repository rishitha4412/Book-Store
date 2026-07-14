import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Theme configuration
import { muiTheme } from './styles/theme';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import LandingPage from './pages/LandingPage';
import BooksPage from './pages/BooksPage';
import BookDetailsPage from './pages/BookDetailsPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CheckoutPage from './pages/CheckoutPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component for Customer Pages
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-app">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Protected Route Component for Admin Dashboard
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-app">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <MuiThemeProvider theme={muiTheme}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <BrowserRouter>
                {/* Global Toast Alerts */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    className: 'glassmorphism border border-border-main text-text-main text-sm font-semibold rounded-2xl shadow-lg px-4 py-3',
                    duration: 3500,
                    style: {
                      background: 'var(--bg-surface)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-main)',
                    },
                    success: {
                      iconTheme: {
                        primary: 'var(--color-success)',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: 'var(--color-danger)',
                        secondary: '#fff',
                      },
                    },
                  }}
                />

                <Routes>
                  {/* Public and Private Routes under Main Layout */}
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/books" element={<BooksPage />} />
                    <Route path="/books/:id" element={<BookDetailsPage />} />
                     <Route
                       path="/cart"
                       element={
                         <ProtectedRoute>
                           <CartPage />
                         </ProtectedRoute>
                       }
                     />
                     <Route
                       path="/wishlist"
                       element={
                         <ProtectedRoute>
                           <WishlistPage />
                         </ProtectedRoute>
                       }
                     />
                     <Route path="/login" element={<LoginPage />} />
                     <Route path="/register" element={<RegisterPage />} />
                     <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                     <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                     <Route
                       path="/checkout"
                       element={
                         <ProtectedRoute>
                           <CheckoutPage />
                         </ProtectedRoute>
                       }
                     />
                     <Route
                       path="/checkout-success"
                       element={
                         <ProtectedRoute>
                           <CheckoutSuccessPage />
                         </ProtectedRoute>
                       }
                     />
                    
                    {/* Customer Protected Routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute>
                          <OrdersPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <SettingsPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Protected Routes */}
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route
                      path="/admin/dashboard"
                      element={
                        <AdminRoute>
                          <AdminDashboardPage />
                        </AdminRoute>
                      }
                    />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </MuiThemeProvider>
    </ThemeProvider>
  );
}

export default App;
