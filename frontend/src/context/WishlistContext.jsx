import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem('bookstore_wishlist');
      return savedWishlist && savedWishlist !== 'undefined' ? JSON.parse(savedWishlist) : [];
    } catch (err) {
      console.error("Stale wishlist detected, resetting:", err);
      return [];
    }
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('bookstore_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = (book) => {
    const isExist = wishlistItems.some((item) => item.id === book.id);
    
    if (isExist) {
      setWishlistItems((prev) => prev.filter((item) => item.id !== book.id));
      toast.success(`Removed "${book.title}" from wishlist.`);
    } else {
      setWishlistItems((prev) => [
        ...prev,
        {
          id: book.id,
          title: book.title,
          price: book.price,
          coverImage: book.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
          author: book.author || 'Unknown Author',
          rating: book.rating || 4.5,
          category: book.category || 'General'
        }
      ]);
      toast.success(`Added "${book.title}" to wishlist.`);
    }
  };

  const removeFromWishlist = (bookId) => {
    const book = wishlistItems.find((item) => item.id === bookId);
    setWishlistItems((prev) => prev.filter((item) => item.id !== bookId));
    if (book) {
      toast.success(`Removed "${book.title}" from wishlist.`);
    }
  };

  const isInWishlist = (bookId) => {
    return wishlistItems.some((item) => item.id === bookId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount: wishlistItems.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
