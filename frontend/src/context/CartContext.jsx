import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { MOCK_COUPONS } from '../utils/mockData';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('bookstore_cart');
      return savedCart && savedCart !== 'undefined' ? JSON.parse(savedCart) : [];
    } catch (err) {
      console.error("Stale cart detected, resetting:", err);
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('bookstore_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (book, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === book.id);
      
      if (existingItem) {
        toast.success(`Updated quantity of "${book.title}" in cart.`);
        return prevItems.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      
      toast.success(`"${book.title}" added to cart.`);
      return [
        ...prevItems,
        {
          id: book.id,
          title: book.title,
          price: book.price,
          coverImage: book.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
          author: book.author || 'Unknown Author',
          quantity
        }
      ];
    });
    setIsCartDrawerOpen(true); // Automatically open cart drawer on item addition
  };

  const removeFromCart = (bookId) => {
    const item = cartItems.find((i) => i.id === bookId);
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== bookId));
    if (item) {
      toast.success(`Removed "${item.title}" from cart.`);
    }
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === bookId ? { ...item, quantity: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('bookstore_cart');
  };

  // Coupon Logic
  const applyCoupon = (code) => {
    const coupon = MOCK_COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) {
      toast.error("Invalid coupon code.");
      return false;
    }
    
    // SAVE10 threshold logic
    if (coupon.code === 'SAVE10' && cartSubtotal < 50) {
      toast.error("Minimum subtotal of $50 required for this coupon.");
      return false;
    }

    setAppliedCoupon(coupon);
    toast.success(`Coupon "${coupon.code}" applied successfully!`);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success("Coupon removed.");
  };

  // Calculations
  const cartSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Validate SAVE10 threshold dynamically if quantity is reduced
  useEffect(() => {
    if (appliedCoupon && appliedCoupon.code === 'SAVE10' && cartSubtotal < 50) {
      setAppliedCoupon(null);
      toast.error("Coupon SAVE10 removed (subtotal fell below $50).");
    }
  }, [cartSubtotal, appliedCoupon]);

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      cartDiscount = cartSubtotal * appliedCoupon.discount;
    } else if (appliedCoupon.type === 'fixed') {
      cartDiscount = appliedCoupon.discount;
    }
  }

  const cartTax = Math.max(0, (cartSubtotal - cartDiscount) * 0.08); // 8% Sales Tax estimate
  const cartTotal = Math.max(0, (cartSubtotal - cartDiscount) + cartTax);

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
        cartDiscount
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
