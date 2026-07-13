import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiTrash2, FiStar, FiArrowLeft } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-24 text-center">
        <div className="inline-flex p-5 bg-primary/10 text-primary rounded-3xl mb-6">
          <FiHeart className="w-16 h-16" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-text-main mb-2">Your Wishlist is Empty</h2>
        <p className="text-text-muted mb-8 max-w-sm">
          Save items you want to read later. They will show up here, making it easy to buy them anytime!
        </p>
        <Link
          to="/books"
          className="bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 flex items-center gap-2"
        >
          <FiArrowLeft /> Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-text-main mb-8 flex items-center gap-2">
        <FiHeart className="text-red-500 fill-current" /> My Wishlist
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((book) => (
          <div
            key={book.id}
            className="bg-bg-surface border border-border-main rounded-2xl p-4 flex flex-col h-full group hover:shadow-xl transition-all duration-300"
          >
            {/* Cover */}
            <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 relative bg-bg-app border border-border-main/40">
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
              <button
                onClick={() => removeFromWishlist(book.id)}
                className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 dark:bg-black/85 text-text-muted hover:text-red-500 border border-border-main shadow-md transition-all duration-200 hover:scale-110"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Title / Info */}
            <span className="text-[10px] uppercase font-bold text-primary tracking-wider mb-1">
              {book.category}
            </span>
            <Link to={`/books/${book.id}`} className="hover:text-primary transition-colors">
              <h3 className="font-bold text-text-main leading-tight line-clamp-1">
                {book.title}
              </h3>
            </Link>
            <p className="text-sm text-text-muted mt-0.5 mb-2">{book.author}</p>

            <div className="flex items-center gap-1 mb-4 text-amber-500">
              <FiStar className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold text-text-main">{book.rating}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-border-main/60">
              <span className="font-extrabold text-lg text-text-main">
                ${book.price.toFixed(2)}
              </span>
              <button
                onClick={() => {
                  addToCart(book, 1);
                  removeFromWishlist(book.id);
                }}
                className="p-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/10 transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs font-semibold"
              >
                <FiShoppingBag className="w-4 h-4" /> Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
