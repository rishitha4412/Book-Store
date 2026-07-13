import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FiStar, FiShoppingBag, FiArrowLeft, FiHeart, FiFileText, 
  FiCalendar, FiBookOpen, FiShare2, FiHome, FiCheck, 
  FiInfo, FiLayers, FiGlobe, FiChevronRight 
} from 'react-icons/fi';
import { bookService } from '../services/bookService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/ui/BookCard';

export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  
  // Page states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  
  // Hover zoom states
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Cart success animation state
  const [isAdding, setIsAdding] = useState(false);
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  // Add Review states
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please type a review comment.");
      return;
    }

    setSubmittingReview(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Premium animation delay

    const newReview = {
      id: `rev-${Date.now()}`,
      bookId: id,
      userName: user?.name || 'Anonymous User',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      rating: newRating,
      date: new Date().toISOString().split('T')[0],
      comment
    };

    await bookService.addReview(newReview);
    setReviews(prev => [newReview, ...prev]);
    setComment('');
    setNewRating(5);
    setSubmittingReview(false);
    toast.success("Review submitted! Thank you.");
  };

  // 1. Fetch book details, reviews, related books and update recently viewed
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(false);
      try {
        const details = await bookService.getBookById(id);
        setBook(details);
        setActiveImage(details.coverImage || '');
        
        // Fetch specific reviews
        const reviewData = await bookService.getReviewsByBookId(id);
        setReviews(reviewData);
        
        // Fetch related books
        const relatedData = await bookService.getBooks({ category: details.category });
        setRelatedBooks(relatedData.books.filter(b => b.id !== id).slice(0, 4));

        // Manage Recently Viewed in LocalStorage
        const stored = localStorage.getItem('bookstore_recently_viewed');
        let items = stored ? JSON.parse(stored) : [];
        items = items.filter(item => item.id !== id);
        const updated = [details, ...items].slice(0, 5);
        localStorage.setItem('bookstore_recently_viewed', JSON.stringify(updated));
        
        // Update state
        setRecentlyViewed(updated.filter(item => item.id !== id));
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-bg-app">
        <div className="animate-pulse space-y-6 w-full max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 h-[450px] bg-border-main/20 rounded-3xl"></div>
            <div className="md:col-span-7 space-y-4">
              <div className="h-4 bg-border-main/20 rounded w-1/4"></div>
              <div className="h-10 bg-border-main/20 rounded w-3/4"></div>
              <div className="h-6 bg-border-main/20 rounded w-1/3"></div>
              <div className="h-24 bg-border-main/20 rounded w-full"></div>
              <div className="h-12 bg-border-main/20 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center px-4 bg-bg-app text-center">
        <h2 className="text-2xl font-bold mb-2 text-text-main">Book Not Found</h2>
        <p className="text-text-muted mb-6">The book you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/books')}
          className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md flex items-center gap-2 transition-all"
        >
          <FiArrowLeft /> Back to Library
        </button>
      </div>
    );
  }

  // Price calculations
  const hasDiscount = book.discount > 0;
  const finalPrice = hasDiscount 
    ? book.price * (1 - book.discount / 100) 
    : book.price;

  const handleQtyChange = (type) => {
    if (type === 'inc') setQuantity((prev) => prev + 1);
    else if (type === 'dec' && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 600)); // Premium micro-delay
    addToCart(book, quantity);
    setIsAdding(false);
    setIsAddedSuccess(true);
    setTimeout(() => setIsAddedSuccess(false), 2000);
  };

  // Image Zoom handler
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Rating Statistics
  const reviewsCount = reviews.length;
  const averageRating = reviewsCount > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount).toFixed(1) 
    : book.rating.toFixed(1);

  const starPercentages = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    const percentage = reviewsCount > 0 ? (count / reviewsCount) * 100 : (star === 5 ? 80 : star === 4 ? 20 : 0);
    return { star, count, percentage };
  });

  return (
    <div className="min-h-screen pt-24 pb-16 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold text-text-muted mb-8 uppercase tracking-wider">
          <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <FiHome className="w-3.5 h-3.5" /> Home
          </Link>
          <FiChevronRight className="text-border-main" />
          <Link to="/books" className="hover:text-primary transition-colors">Books</Link>
          <FiChevronRight className="text-border-main" />
          <Link to={`/books?category=${book.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} className="hover:text-primary transition-colors">{book.category}</Link>
          <FiChevronRight className="text-border-main" />
          <span className="text-text-main truncate max-w-[200px]">{book.title}</span>
        </nav>

        {/* Main Details Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-bg-surface border border-border-main rounded-3xl p-6 sm:p-10 shadow-sm mb-12">
          
          {/* Left: Gallery & Thumbnail Panel */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Big Preview with Hover Zoom */}
            <div 
              className="aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-xl border border-border-main/50 relative bg-bg-app cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <img
                src={activeImage}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-100 ease-out"
                style={{
                  transform: isZoomed ? 'scale(1.8)' : 'scale(1)',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                }}
              />
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md z-10 animate-pulse">
                  {book.discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            <div className="grid grid-cols-4 gap-3">
              {book.gallery && book.gallery.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-[3/4] rounded-xl overflow-hidden border-2 bg-bg-app transition-all hover:scale-102 cursor-pointer ${
                    activeImage === img ? 'border-primary shadow-md scale-102' : 'border-border-main/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info & Purchase Controls */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="flex justify-between items-start gap-4 mb-2">
              <span className="inline-flex px-3.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary w-fit">
                {book.category}
              </span>
              <button 
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-border-main hover:bg-bg-app text-text-muted hover:text-text-main transition-all cursor-pointer"
                title="Share Book"
              >
                <FiShare2 className="w-4.5 h-4.5" />
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main tracking-tight leading-tight mb-2">
              {book.title}
            </h1>
            <p className="text-base text-text-muted mb-4">By <span className="font-semibold text-text-main">{book.author}</span></p>

            {/* Stars rating summary */}
            <div className="flex items-center gap-1.5 mb-6 text-amber-500">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <FiStar key={idx} className={`w-4.5 h-4.5 ${idx < Math.floor(book.rating) ? 'fill-current' : 'text-border-main'}`} />
                ))}
              </div>
              <span className="text-sm font-extrabold text-text-main ml-1">{averageRating}</span>
              <span className="text-sm text-text-muted">({reviewsCount} customer reviews)</span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mb-6 p-4 rounded-2xl bg-bg-app/40 border border-border-main/50">
              <span className="text-3xl font-black text-text-main">
                ${finalPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-text-muted line-through">
                    ${book.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-green-600 font-bold bg-green-500/10 px-2 py-0.5 rounded-md">
                    Save ${(book.price - finalPrice).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-text-muted leading-relaxed mb-8">
              {book.description.substring(0, 240)}...
            </p>

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-center mt-auto pt-6 border-t border-border-main/50">
              
              {/* Quantity */}
              <div className="flex items-center border border-border-main rounded-xl p-1 bg-bg-app shrink-0">
                <button
                  onClick={() => handleQtyChange('dec')}
                  className="w-11 h-11 flex items-center justify-center font-bold text-lg hover:bg-bg-surface rounded-lg transition-colors text-text-main"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold text-sm text-text-main">{quantity}</span>
                <button
                  onClick={() => handleQtyChange('inc')}
                  className="w-11 h-11 flex items-center justify-center font-bold text-lg hover:bg-bg-surface rounded-lg transition-colors text-text-main"
                >
                  +
                </button>
              </div>

              {/* Add To Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding || isAddedSuccess}
                className="flex-1 w-full bg-primary hover:bg-primary-hover disabled:bg-primary/80 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAdding ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : isAddedSuccess ? (
                  <span className="flex items-center gap-1.5"><FiCheck className="w-5 h-5" /> Added to Cart!</span>
                ) : (
                  <span className="flex items-center gap-1.5"><FiShoppingBag /> Add to Cart — ${(finalPrice * quantity).toFixed(2)}</span>
                )}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(book)}
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isInWishlist(book.id)
                    ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20'
                    : 'border-border-main text-text-main hover:bg-bg-app hover:scale-102'
                }`}
                title={isInWishlist(book.id) ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <FiHeart className={`w-5 h-5 ${isInWishlist(book.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabbed Info & Metadata */}
        <div className="bg-bg-surface border border-border-main rounded-3xl overflow-hidden mb-12 shadow-sm">
          {/* Tab buttons header */}
          <div className="flex border-b border-border-main/50 bg-bg-app/40 text-sm font-semibold">
            {[
              { id: 'description', label: 'Description', icon: FiFileText },
              { id: 'specifications', label: 'Specifications', icon: FiLayers },
              { id: 'author', label: 'Author Details', icon: FiBookOpen }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? 'border-primary text-primary bg-bg-surface' 
                    : 'border-transparent text-text-muted hover:text-text-main'
                }`}
              >
                <tab.icon className="w-4.5 h-4.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="text-text-muted leading-relaxed text-sm space-y-4"
                >
                  <p>{book.description}</p>
                </motion.div>
              )}

              {activeTab === 'specifications' && (
                <motion.div
                  key="specifications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm"
                >
                  <div className="p-4 bg-bg-app/30 border border-border-main/40 rounded-2xl">
                    <p className="text-xs text-text-muted">Publisher</p>
                    <p className="font-bold text-text-main mt-1 flex items-center gap-1.5">
                      <FiInfo className="text-primary w-4 h-4" /> {book.publisher}
                    </p>
                  </div>
                  <div className="p-4 bg-bg-app/30 border border-border-main/40 rounded-2xl">
                    <p className="text-xs text-text-muted">ISBN</p>
                    <p className="font-bold text-text-main mt-1 flex items-center gap-1.5">
                      <FiLayers className="text-primary w-4 h-4" /> {book.isbn}
                    </p>
                  </div>
                  <div className="p-4 bg-bg-app/30 border border-border-main/40 rounded-2xl">
                    <p className="text-xs text-text-muted">Language</p>
                    <p className="font-bold text-text-main mt-1 flex items-center gap-1.5">
                      <FiGlobe className="text-primary w-4 h-4" /> {book.language}
                    </p>
                  </div>
                  <div className="p-4 bg-bg-app/30 border border-border-main/40 rounded-2xl">
                    <p className="text-xs text-text-muted">Pages</p>
                    <p className="font-bold text-text-main mt-1 flex items-center gap-1.5">
                      <FiBookOpen className="text-primary w-4 h-4" /> {book.pages} pages
                    </p>
                  </div>
                  <div className="p-4 bg-bg-app/30 border border-border-main/40 rounded-2xl">
                    <p className="text-xs text-text-muted">Publication Date</p>
                    <p className="font-bold text-text-main mt-1 flex items-center gap-1.5">
                      <FiCalendar className="text-primary w-4 h-4" /> {book.publishedDate}
                    </p>
                  </div>
                  <div className="p-4 bg-bg-app/30 border border-border-main/40 rounded-2xl">
                    <p className="text-xs text-text-muted">Stock Status</p>
                    <p className={`font-bold mt-1 flex items-center gap-1.5 ${book.inStock ? 'text-green-600' : 'text-red-500'}`}>
                      <FiCheck className={`w-4 h-4 ${book.inStock ? 'text-green-600' : 'text-red-500'}`} />
                      {book.inStock ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'author' && (
                <motion.div
                  key="author"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col sm:flex-row items-center gap-6"
                >
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-black shrink-0 border border-primary/20">
                    {book.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-text-main">{book.author}</h3>
                    <p className="text-xs text-text-muted mb-3 font-semibold">Verified Author</p>
                    <p className="text-sm text-text-muted leading-relaxed">{book.authorBio}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Customer Reviews & Breakdown */}
        <div className="bg-bg-surface border border-border-main rounded-3xl p-6 sm:p-10 shadow-sm mb-12">
          <h2 className="text-2xl font-black text-text-main mb-8">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-10 pb-8 border-b border-border-main/50">
            {/* Left summary dashboard */}
            <div className="md:col-span-4 text-center p-6 bg-bg-app/40 rounded-3xl border border-border-main/40">
              <p className="text-5xl font-black text-text-main">{averageRating}</p>
              <div className="flex justify-center text-amber-500 gap-0.5 mt-2 mb-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <FiStar key={idx} className={`w-5 h-5 ${idx < Math.floor(parseFloat(averageRating)) ? 'fill-current' : 'text-border-main'}`} />
                ))}
              </div>
              <p className="text-xs text-text-muted font-bold uppercase tracking-wider mt-1">{reviewsCount} customer ratings</p>
            </div>

            {/* Right progress bars */}
            <div className="md:col-span-8 space-y-3">
              {starPercentages.map(bar => (
                <div key={bar.star} className="flex items-center gap-4 text-sm font-semibold">
                  <span className="w-12 text-text-main text-right shrink-0">{bar.star} stars</span>
                  <div className="flex-1 h-3 bg-bg-app rounded-full overflow-hidden border border-border-main/30">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bar.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500"
                    />
                  </div>
                  <span className="w-12 text-text-muted shrink-0 text-left">{bar.percentage.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews cards */}
          <div className="space-y-4">
            {reviews.map((rev) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="p-6 bg-bg-app/20 border border-border-main rounded-2xl"
              >
                <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <img src={rev.avatar} alt={rev.userName} className="w-10 h-10 rounded-xl object-cover border border-border-main" />
                    <div>
                      <h4 className="font-extrabold text-sm text-text-main">{rev.userName}</h4>
                      {rev.role && (
                        <p className="text-[10px] text-text-muted mt-0.5 font-medium">{rev.role} at <span className="text-primary font-semibold">{rev.company}</span></p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex text-amber-500 gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <FiStar key={idx} className={`w-3.5 h-3.5 ${idx < rev.rating ? 'fill-current' : 'text-border-main'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-text-muted">{rev.date}</span>
                  </div>
                </div>
                <p className="text-sm text-text-main leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </motion.div>
            ))}
          </div>

          {/* Add Review Form */}
          <div className="mt-12 pt-8 border-t border-border-main/50 max-w-2xl">
            <h3 className="font-extrabold text-lg text-text-main mb-6">Write a Customer Review</h3>
            
            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                
                {/* Interactive Star Rating Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main uppercase tracking-wider block">Your Rating</label>
                  <div className="flex items-center gap-1.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 rounded-md hover:bg-bg-app hover:scale-110 transition-all cursor-pointer bg-transparent border-0"
                      >
                        <FiStar 
                          className={`w-6 h-6 transition-all ${
                            star <= (hoverRating || newRating) ? 'fill-current' : 'text-border-main'
                          }`} 
                        />
                      </button>
                    ))}
                    <span className="text-xs text-text-muted font-semibold ml-2">
                      {newRating === 5 ? 'Excellent!' : newRating === 4 ? 'Great' : newRating === 3 ? 'Good' : newRating === 2 ? 'Fair' : 'Poor'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main uppercase tracking-wider">Comment/Review</label>
                  <textarea
                    rows="4"
                    placeholder="Share details of your experience with this book..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 bg-bg-app border border-border-main rounded-2xl text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submittingReview ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Submit Review'
                  )}
                </button>

              </form>
            ) : (
              <div className="p-6 border border-dashed border-border-main rounded-2xl text-center bg-bg-app/10">
                <p className="text-sm text-text-muted">You must be signed in to leave a review.</p>
                <Link 
                  to="/login" 
                  className="mt-3 inline-flex px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-105"
                >
                  Sign In to Review
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div className="mb-12 border-t border-border-main/40 pt-12">
            <h2 className="text-2xl font-black text-text-main mb-8">Related Masterpieces</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBooks.map(item => (
                <BookCard key={item.id} book={item} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="border-t border-border-main/40 pt-12">
            <h2 className="text-2xl font-black text-text-main mb-8">Recently Viewed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.map(item => (
                <BookCard key={item.id} book={item} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
