import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loadingCart, setLoadingCart] = useState(false);

  // Helper: Map backend cart items to frontend structure
  const mapBackendCartToLocal = (items = []) => {
    return items.map((item) => {
      const bookInfo = item.book || {};
      return {
        id: bookInfo._id || bookInfo.id || item.book,
        title: bookInfo.title || item.title || 'Book Title',
        price: item.price,
        coverImage: bookInfo.coverImage || item.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
        author: bookInfo.author || 'Unknown Author',
        quantity: item.quantity,
      };
    });
  };

  // Sync cart state on login/logout
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        setLoadingCart(true);
        try {
          const response = await api.get('/cart');
          const cartData = response.data.data;
          setCartItems(mapBackendCartToLocal(cartData.items));
        } catch (err) {
          console.error('Failed to load cart from database:', err);
        } finally {
          setLoadingCart(false);
        }
      } else {
        // Fallback to local storage for guests
        const savedCart = localStorage.getItem('bookstore_cart');
        setCartItems(savedCart && savedCart !== 'undefined' ? JSON.parse(savedCart) : []);
        setAppliedCoupon(null);
      }
    };
    loadCart();
  }, [user]);

  // Sync guest cart to local storage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('bookstore_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (book, quantity = 1) => {
    const bookId = book._id || book.id;
    
    if (user) {
      try {
        const response = await api.post('/cart', { bookId, quantity });
        const updatedCart = response.data.data;
        setCartItems(mapBackendCartToLocal(updatedCart.items));
        toast.success(`"${book.title}" added to cart.`);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to add item to cart.');
      }
    } else {
      // Guest local state
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === bookId);
        if (existingItem) {
          toast.success(`Updated quantity of "${book.title}" in cart.`);
          return prevItems.map((item) =>
            item.id === bookId ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        toast.success(`"${book.title}" added to cart.`);
        return [
          ...prevItems,
          {
            id: bookId,
            title: book.title,
            price: book.discount > 0 ? parseFloat((book.price * (1 - book.discount / 100)).toFixed(2)) : book.price,
            coverImage: book.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
            author: book.author || 'Unknown Author',
            quantity,
          },
        ];
      });
    }
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = async (bookId) => {
    if (user) {
      try {
        const response = await api.delete(`/cart/${bookId}`);
        const updatedCart = response.data.data;
        setCartItems(mapBackendCartToLocal(updatedCart.items));
        toast.success('Item removed from cart.');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to remove item from cart.');
      }
    } else {
      // Guest local state
      const item = cartItems.find((i) => i.id === bookId);
      setCartItems((prevItems) => prevItems.filter((i) => i.id !== bookId));
      if (item) {
        toast.success(`Removed "${item.title}" from cart.`);
      }
    }
  };

  const updateQuantity = async (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }

    if (user) {
      try {
        const response = await api.put(`/cart/${bookId}`, { quantity });
        const updatedCart = response.data.data;
        setCartItems(mapBackendCartToLocal(updatedCart.items));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update quantity.');
      }
    } else {
      // Guest local state
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === bookId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.delete('/cart');
        setCartItems([]);
        setAppliedCoupon(null);
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    } else {
      setCartItems([]);
      setAppliedCoupon(null);
      localStorage.removeItem('bookstore_cart');
    }
  };

  // Coupon Logic
  const applyCoupon = async (code) => {
    if (!user) {
      toast.error('Please log in to apply discount coupons.');
      return false;
    }

    try {
      const response = await api.get(`/coupons/validate/${code.toUpperCase()}`);
      const coupon = response.data.data;
      
      // Fixed discount SAVE10 subtotal threshold logic
      if (coupon.code === 'SAVE10' && cartSubtotal < 50) {
        toast.error('Minimum subtotal of $50 required for coupon SAVE10.');
        return false;
      }

      setAppliedCoupon(coupon);
      toast.success(`Coupon "${coupon.code}" applied successfully!`);
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid coupon code.';
      toast.error(message);
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed.');
  };

  // Calculations
  const cartSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Validate SAVE10 threshold dynamically if subtotal changes
  useEffect(() => {
    if (appliedCoupon && appliedCoupon.code === 'SAVE10' && cartSubtotal < 50) {
      setAppliedCoupon(null);
      toast.error('Coupon SAVE10 removed (subtotal fell below $50).');
    }
  }, [cartSubtotal, appliedCoupon]);

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage' || appliedCoupon.type === 'percentage') {
      const rate = appliedCoupon.discountAmount || (appliedCoupon.discount * 100);
      cartDiscount = cartSubtotal * (rate / 100);
    } else {
      const amount = appliedCoupon.discountAmount || appliedCoupon.discount;
      cartDiscount = amount;
    }
  }

  const cartTax = Math.max(0, (cartSubtotal - cartDiscount) * 0.05); // Match backend 5% tax
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartTax);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartTax,
        cartTotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartDiscount,
        loadingCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
