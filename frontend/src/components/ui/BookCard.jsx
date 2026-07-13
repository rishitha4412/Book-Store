import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingBag, FiHeart, FiEye, FiBookOpen } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function BookCard({ book, onQuickView, layout = 'grid' }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Price calculations
  const hasDiscount = book.discount > 0;
  const finalPrice = hasDiscount 
    ? book.price * (1 - book.discount / 100) 
    : book.price;

  const isList = layout === 'list';

  if (isList) {
    return (
      <motion.div
        layout
        whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
        className="bg-bg-surface border border-border-main rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 hover:shadow-lg transition-all duration-300 w-full"
      >
        {/* Cover Image Wrapper */}
        <div className="w-full sm:w-40 aspect-[3/4] rounded-xl overflow-hidden relative bg-bg-app border border-border-main/40 shrink-0 self-center">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
              {book.discount}% OFF
            </span>
          )}

          {/* Floating Actions overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <button
              onClick={() => onQuickView && onQuickView(book)}
              className="p-2.5 bg-white dark:bg-black/90 text-text-main hover:text-primary rounded-lg shadow-md cursor-pointer"
              title="Quick View"
            >
              <FiEye className="w-4 h-4" />
            </button>
            <button
              onClick={() => addToCart(book, 1)}
              className="p-2.5 bg-primary text-white hover:bg-primary-hover rounded-lg shadow-md cursor-pointer"
              title="Add to Cart"
            >
              <FiShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content details wrapper */}
        <div className="flex-grow flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[9px] sm:text-[10px] uppercase font-extrabold text-primary tracking-wider mb-0.5 block">
                  {book.category}
                </span>
                <Link to={`/books/${book.id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-extrabold text-text-main text-base sm:text-lg leading-snug line-clamp-2">
                    {book.title}
                  </h3>
                </Link>
                <p className="text-xs text-text-muted mt-0.5">By <span className="font-semibold text-text-main">{book.author}</span></p>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(book)}
                className={`p-2.5 rounded-full border shadow-sm backdrop-blur-md transition-all duration-300 shrink-0 cursor-pointer ${
                  isInWishlist(book.id)
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'bg-white/80 dark:bg-black/75 border-border-main text-text-main hover:scale-105'
                }`}
              >
                <FiHeart className={`w-4 h-4 ${isInWishlist(book.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-1 text-amber-500">
              <FiStar className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold text-text-main">{book.rating.toFixed(1)}</span>
              {book.reviewCount !== undefined && (
                <span className="text-xs text-text-muted">({book.reviewCount} reviews)</span>
              )}
            </div>

            {/* Description excerpt */}
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-3">
              {book.description}
            </p>
          </div>

          {/* Pricing & buy action footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-main/50">
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-base sm:text-lg text-text-main">
                ${finalPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-text-muted line-through">
                  ${book.price.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onQuickView && onQuickView(book)}
                className="px-3.5 py-2.5 rounded-xl border border-border-main hover:bg-bg-app text-text-main text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <FiEye /> Details
              </button>
              <button
                onClick={() => addToCart(book, 1)}
                className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/10 transition-all duration-300 hover:scale-[1.02] flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <FiShoppingBag className="w-3.5 h-3.5" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Fallback / Grid Mode
  return (
    <motion.div
      layout
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="bg-bg-surface border border-border-main rounded-2xl p-4 flex flex-col h-full group hover:shadow-xl transition-all duration-300"
    >
      {/* Cover Image Wrapper */}
      <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 relative bg-bg-app border border-border-main/40">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
            {book.discount}% OFF
          </span>
        )}

        {/* Floating Actions overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={() => onQuickView && onQuickView(book)}
            className="p-3 bg-white dark:bg-black/90 text-text-main hover:text-primary rounded-xl shadow-lg hover:scale-110 transition-all duration-200 cursor-pointer"
            title="Quick View"
          >
            <FiEye className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => addToCart(book, 1)}
            className="p-3 bg-primary text-white hover:bg-primary-hover rounded-xl shadow-lg hover:scale-110 transition-all duration-200 cursor-pointer"
            title="Add to Cart"
          >
            <FiShoppingBag className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Button (Always visible / Floating) */}
        <button
          onClick={() => toggleWishlist(book)}
          className={`absolute top-3 right-3 p-2.5 rounded-full border shadow-md backdrop-blur-md transition-all duration-300 z-10 cursor-pointer ${
            isInWishlist(book.id)
              ? 'bg-red-500 border-red-500 text-white'
              : 'bg-white/80 dark:bg-black/75 border-border-main text-text-main hover:scale-110'
          }`}
          title={isInWishlist(book.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <FiHeart className={`w-4 h-4 ${isInWishlist(book.id) ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Metadata */}
      <span className="text-[10px] uppercase font-extrabold text-primary tracking-wider mb-1 block">
        {book.category}
      </span>
      
      <Link to={`/books/${book.id}`} className="hover:text-primary transition-colors">
        <h3 className="font-bold text-text-main leading-tight line-clamp-1 group-hover:text-primary transition-colors text-sm sm:text-base">
          {book.title}
        </h3>
      </Link>
      <p className="text-xs text-text-muted mt-0.5 mb-2 font-medium">{book.author}</p>

      {/* Ratings */}
      <div className="flex items-center gap-1 mb-4 text-amber-500">
        <FiStar className="w-3.5 h-3.5 fill-current" />
        <span className="text-xs font-bold text-text-main">{book.rating.toFixed(1)}</span>
        {book.reviewCount !== undefined && (
          <span className="text-xs text-text-muted">({book.reviewCount})</span>
        )}
      </div>

      {/* Pricing & Cart Action */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border-main/60">
        <div className="flex flex-col">
          {hasDiscount && (
            <span className="text-xs text-text-muted line-through">
              ${book.price.toFixed(2)}
            </span>
          )}
          <span className="font-extrabold text-base sm:text-lg text-text-main">
            ${finalPrice.toFixed(2)}
          </span>
        </div>

        <button
          onClick={() => addToCart(book, 1)}
          className="px-3.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/10 transition-all duration-300 hover:scale-102 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <FiShoppingBag className="w-3.5 h-3.5" /> Buy
        </button>
      </div>
    </motion.div>
  );
}
