import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingBag, FiHeart, FiSun, FiMoon, FiMenu, FiX, 
  FiUser, FiLogOut, FiSettings, FiGrid, FiBriefcase, FiBookOpen 
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { cartCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Browse Books', path: '/books' },
    { name: 'Categories', path: '/books?category=' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-border-main/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2.5 bg-primary text-white rounded-xl shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                <FiBookOpen className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-text-main group-hover:text-primary transition-colors">
                Book<span className="text-primary font-bold">Haven</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    location.pathname === link.path
                      ? 'text-primary bg-primary/5'
                      : 'text-text-muted hover:text-text-main hover:bg-bg-surface/60'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-border-main hover:bg-bg-surface text-text-muted hover:text-text-main transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2.5 rounded-xl border border-border-main hover:bg-bg-surface text-text-muted hover:text-text-main transition-all duration-200 relative"
              aria-label="Wishlist"
            >
              <FiHeart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-bg-surface"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-2.5 rounded-xl border border-border-main hover:bg-bg-surface text-text-muted hover:text-text-main transition-all duration-200 relative cursor-pointer bg-transparent"
              aria-label="Cart"
            >
              <FiShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-bg-surface"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* Auth/Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-border-main hover:bg-bg-surface transition-all duration-200 cursor-pointer"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                </button>

                {/* Profile dropdown menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <>
                      {/* Backdrop to close click */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setUserDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-bg-surface border border-border-main rounded-2xl shadow-xl py-2 z-20"
                      >
                        <div className="px-4 py-2 border-b border-border-main/50 mb-1">
                          <p className="text-xs text-text-muted">Signed in as</p>
                          <p className="font-bold text-text-main truncate">{user.name}</p>
                        </div>

                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-text-main hover:bg-bg-app transition-colors"
                          >
                            <FiBriefcase className="w-4 h-4 text-primary" /> Admin Control
                          </Link>
                        )}

                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-text-main hover:bg-bg-app transition-colors"
                        >
                          <FiGrid className="w-4 h-4 text-text-muted" /> Dashboard
                        </Link>

                        <Link
                          to="/settings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-text-main hover:bg-bg-app transition-colors"
                        >
                          <FiSettings className="w-4 h-4 text-text-muted" /> Settings
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/5 transition-colors border-t border-border-main/50 mt-1.5"
                        >
                          <FiLogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary hover:bg-primary-hover text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-primary/10 transition-all duration-300 hover:scale-[1.02]"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Actions/Burger menu */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-border-main text-text-muted hover:text-text-main"
            >
              {isDarkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-2 rounded-lg border border-border-main text-text-muted hover:text-text-main relative cursor-pointer bg-transparent"
            >
              <FiShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg border border-border-main text-text-muted hover:text-text-main"
            >
              <FiMenu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-full bg-bg-surface border-l border-border-main p-6 shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-extrabold text-lg text-text-main">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg border border-border-main text-text-muted hover:text-text-main"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Links */}
              <div className="flex flex-col gap-3">
                <Link
                  to="/books"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl hover:bg-bg-app font-bold text-text-main transition-colors text-sm"
                >
                  Browse Books
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl hover:bg-bg-app font-bold text-text-main flex items-center justify-between transition-colors text-sm"
                >
                  Wishlist {wishlistCount > 0 && <span className="bg-red-500/10 text-red-500 text-xs px-2.5 py-0.5 rounded-full font-bold">{wishlistCount}</span>}
                </Link>
              </div>

              {/* Bottom Mobile Profile Info */}
              <div className="mt-auto border-t border-border-main/60 pt-6">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-text-main text-sm">{user.name}</p>
                        <p className="text-xs text-text-muted truncate">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-4 py-2.5 rounded-xl hover:bg-primary/5 text-primary text-sm font-semibold flex items-center gap-2"
                        >
                          <FiBriefcase className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-2.5 rounded-xl hover:bg-bg-app text-text-main text-sm font-semibold flex items-center gap-2"
                      >
                        <FiGrid className="w-4 h-4" /> Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-red-500/5 text-red-500 text-sm font-semibold flex items-center gap-2"
                      >
                        <FiLogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
