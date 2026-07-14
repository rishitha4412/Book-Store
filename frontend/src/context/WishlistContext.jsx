import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api.js';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Helper: Map backend books list to frontend structure
  const mapBackendWishlistToLocal = (books = []) => {
    return books.map((book) => ({
      id: book._id || book.id,
      title: book.title,
      price: book.price,
      coverImage: book.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
      author: book.author || 'Unknown Author',
      rating: book.rating || 4.5,
      category: book.category || 'General',
    }));
  };

  // Sync wishlist on login/logout
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        setLoadingWishlist(true);
        try {
          const response = await api.get('/wishlist');
          const wishlist = response.data.data;
          setWishlistItems(mapBackendWishlistToLocal(wishlist.books));
        } catch (err) {
          console.error('Failed to load wishlist from database:', err);
        } finally {
          setLoadingWishlist(false);
        }
      } else {
        const savedWishlist = localStorage.getItem('bookstore_wishlist');
        setWishlistItems(savedWishlist && savedWishlist !== 'undefined' ? JSON.parse(savedWishlist) : []);
      }
    };
    loadWishlist();
  }, [user]);

  // Sync guest wishlist to local storage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('bookstore_wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, user]);

  const toggleWishlist = async (book) => {
    const bookId = book._id || book.id;
    const isExist = wishlistItems.some((item) => item.id === bookId);

    if (user) {
      try {
        if (isExist) {
          // DELETE from backend
          const response = await api.delete(`/wishlist/${bookId}`);
          setWishlistItems(mapBackendWishlistToLocal(response.data.data.books));
          toast.success(`Removed "${book.title}" from wishlist.`);
        } else {
          // POST to backend
          const response = await api.post('/wishlist', { bookId });
          setWishlistItems(mapBackendWishlistToLocal(response.data.data.books));
          toast.success(`Added "${book.title}" to wishlist.`);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to toggle wishlist.');
      }
    } else {
      // Guest local state
      if (isExist) {
        setWishlistItems((prev) => prev.filter((item) => item.id !== bookId));
        toast.success(`Removed "${book.title}" from wishlist.`);
      } else {
        setWishlistItems((prev) => [
          ...prev,
          {
            id: bookId,
            title: book.title,
            price: book.price,
            coverImage: book.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
            author: book.author || 'Unknown Author',
            rating: book.rating || 4.5,
            category: book.category || 'General',
          },
        ]);
        toast.success(`Added "${book.title}" to wishlist.`);
      }
    }
  };

  const removeFromWishlist = async (bookId) => {
    if (user) {
      try {
        const response = await api.delete(`/wishlist/${bookId}`);
        setWishlistItems(mapBackendWishlistToLocal(response.data.data.books));
        toast.success('Removed item from wishlist.');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to remove from wishlist.');
      }
    } else {
      // Guest local state
      const item = wishlistItems.find((i) => i.id === bookId);
      setWishlistItems((prev) => prev.filter((i) => i.id !== bookId));
      if (item) {
        toast.success(`Removed "${item.title}" from wishlist.`);
      }
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
        wishlistCount: wishlistItems.length,
        loadingWishlist,
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
