import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar, FiShoppingBag, FiHeart, FiMaximize2 } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function QuickViewModal({ book, onClose }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  if (!book) return null;

  const hasDiscount = book.discount > 0;
  const finalPrice = hasDiscount 
    ? book.price * (1 - book.discount / 100) 
    : book.price;

  const handleQtyChange = (type) => {
    if (type === 'inc') setQuantity(prev => prev + 1);
    else if (type === 'dec' && quantity > 1) setQuantity(prev => prev - 1);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black backdrop-blur-sm"
        />

        {/* Modal Content panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative max-w-3xl w-full bg-bg-surface border border-border-main rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row"
        >
          {/* Top banner accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary z-20"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-bg-app hover:bg-border-main text-text-muted hover:text-text-main transition-colors border border-border-main/50 z-20 cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Image section */}
          <div className="md:w-5/12 bg-bg-app/40 p-8 flex items-center justify-center border-r border-border-main/40">
            <div className="w-48 aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-border-main/40">
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Info section */}
          <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider mb-1 block">
                {book.category}
              </span>
              <h3 className="font-extrabold text-2xl text-text-main leading-tight mb-2 pr-8">
                {book.title}
              </h3>
              <p className="text-sm text-text-muted mb-4 font-semibold">By {book.author}</p>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mb-4 text-amber-500">
                <FiStar className="w-4 h-4 fill-current" />
                <span className="text-sm font-extrabold text-text-main">{book.rating.toFixed(1)}</span>
                <span className="text-sm text-text-muted">({book.reviewCount} Reviews)</span>
              </div>

              {/* Description */}
              <p className="text-sm text-text-main leading-relaxed mb-6 line-clamp-4">
                {book.description}
              </p>
            </div>

            {/* Actions block */}
            <div className="space-y-4 border-t border-border-main/50 pt-4">
              
              {/* Pricing row */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-text-main">
                  ${(finalPrice * quantity).toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-text-muted line-through">
                    ${(book.price * quantity).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Quantity selector & Add row */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* Quantity */}
                <div className="flex items-center border border-border-main rounded-xl p-0.5 bg-bg-app">
                  <button
                    onClick={() => handleQtyChange('dec')}
                    className="w-9 h-9 flex items-center justify-center font-bold text-lg hover:bg-bg-surface rounded-lg transition-colors text-text-main"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-text-main">{quantity}</span>
                  <button
                    onClick={() => handleQtyChange('inc')}
                    className="w-9 h-9 flex items-center justify-center font-bold text-lg hover:bg-bg-surface rounded-lg transition-colors text-text-main"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={() => {
                    addToCart(book, quantity);
                    onClose();
                  }}
                  className="flex-1 min-w-[140px] bg-primary hover:bg-primary-hover text-white font-bold py-2.5 rounded-xl shadow-md shadow-primary/10 transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-1.5 text-sm cursor-pointer"
                >
                  <FiShoppingBag className="w-4 h-4" /> Add — ${(finalPrice * quantity).toFixed(2)}
                </button>

                {/* Wishlist Toggle */}
                <button
                  onClick={() => toggleWishlist(book)}
                  className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isInWishlist(book.id)
                      ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-500/10'
                      : 'border-border-main text-text-main hover:bg-bg-app'
                  }`}
                  title="Wishlist"
                >
                  <FiHeart className={`w-4.5 h-4.5 ${isInWishlist(book.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* More info detail CTA */}
              <Link
                to={`/books/${book.id}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover transition-colors mt-2 hover:underline"
              >
                <FiMaximize2 className="w-3.5 h-3.5" /> Open Detailed Product Sheet
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
