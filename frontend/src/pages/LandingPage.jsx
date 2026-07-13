import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowRight, FiBookOpen, FiShoppingBag, FiTruck, FiShield, 
  FiRotateCcw, FiAward, FiStar, FiChevronLeft, FiChevronRight, FiMail,
  FiUser
} from 'react-icons/fi';

// Services & Hooks
import { bookService } from '../services/bookService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// Reusable Components
import SectionTitle from '../components/ui/SectionTitle';
import BookCard from '../components/ui/BookCard';
import CategoryCard from '../components/ui/CategoryCard';
import StatisticCard from '../components/ui/StatisticCard';
import TestimonialCard from '../components/ui/TestimonialCard';
import FAQ from '../components/ui/FAQ';
import QuickViewModal from '../components/ui/QuickViewModal';

export default function LandingPage() {
  const [categories, setCategories] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState(null);
  const [faqs, setFaqs] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  
  // Quick View State
  const [selectedBook, setSelectedBook] = useState(null);

  // Testimonials slide index
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, feat, best, trend, newArrv, tests, statData, faqData] = await Promise.all([
          bookService.getCategories(),
          bookService.getFeaturedBooks(),
          bookService.getBestSellers(),
          bookService.getTrendingBooks(),
          bookService.getNewArrivals(),
          bookService.getTestimonials(),
          bookService.getStats(),
          bookService.getFaqs()
        ]);
        setCategories(cats);
        setFeaturedBooks(feat.slice(0, 4));
        setBestSellers(best.slice(0, 4));
        setTrendingBooks(trend.slice(0, 4));
        setNewArrivals(newArrv.slice(0, 4));
        setTestimonials(tests);
        setStats(statData);
        setFaqs(faqData);
      } catch (err) {
        console.error("Failed loading Bookstore landing metadata", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary mb-6">
                <FiBookOpen className="w-3.5 h-3.5" /> Direct Publisher Editions
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-text-main tracking-tight leading-none mb-6">
                Expand your mind with <br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  exceptional books.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-text-muted mb-8 max-w-xl leading-relaxed">
                Explore our curated catalog of technical blueprints, business bestsellers, and literary masterpieces designed to support your development.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/books"
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 transform hover:-y-0.5"
                >
                  Browse Catalogue <FiArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#featured"
                  className="inline-flex items-center justify-center gap-2 glassmorphism border border-border-main hover:bg-bg-surface/50 text-text-main font-bold px-8 py-3.5 rounded-xl transition-all duration-300"
                >
                  Featured Collections
                </a>
              </div>
            </motion.div>

            {/* Premium Book Graphic */}
            <motion.div
              className="lg:col-span-5 relative flex justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="w-64 sm:w-80 h-[380px] sm:h-[440px] relative rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500 group border border-border-main/50">
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"
                  alt="Atomic Habits Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                  <span className="text-[10px] uppercase tracking-wider text-primary font-bold mb-1">Weekly Best Seller</span>
                  <h3 className="text-xl font-bold">Atomic Habits</h3>
                  <p className="text-xs text-gray-300">James Clear</p>
                </div>
              </div>

              {/* Floating element 1 */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -left-6 p-4 rounded-2xl glassmorphism border border-border-main/60 shadow-lg hidden sm:flex items-center gap-3"
              >
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl"><FiStar className="fill-current" /></div>
                <div>
                  <p className="font-extrabold text-xs text-text-main">4.9 Star Rating</p>
                  <p className="text-[10px] text-text-muted">Over 14,000 reviews</p>
                </div>
              </motion.div>

              {/* Floating element 2 */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-6 -right-6 p-4 rounded-2xl glassmorphism border border-border-main/60 shadow-lg hidden sm:flex items-center gap-3"
              >
                <div className="p-2.5 bg-green-500/10 text-green-500 rounded-xl"><FiShoppingBag /></div>
                <div>
                  <p className="font-extrabold text-xs text-text-main">In Stock</p>
                  <p className="text-[10px] text-text-muted">Same-day shipping</p>
                </div>
              </motion.div>

              {/* Backlight circles */}
              <div className="absolute -z-10 w-80 h-80 rounded-full bg-primary/10 blur-3xl -top-10 -right-10"></div>
              <div className="absolute -z-10 w-80 h-80 rounded-full bg-secondary/10 blur-3xl -bottom-10 -left-10"></div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60">
          <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-text-muted rounded-full"
          />
        </div>
      </section>

      {/* 2. Trusted By & Statistics Section */}
      <section className="py-16 border-y border-border-main bg-bg-surface/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-24 bg-border-main/20 animate-pulse rounded-2xl"></div>
              ))
            ) : (
              stats && (
                <>
                  <StatisticCard value={stats.readers.value} suffix={stats.readers.suffix} label={stats.readers.label} icon={FiAward} />
                  <StatisticCard value={stats.books.value} suffix={stats.books.suffix} label={stats.books.label} icon={FiBookOpen} />
                  <StatisticCard value={stats.authors.value} suffix={stats.authors.suffix} label={stats.authors.label} icon={FiUser} />
                  <StatisticCard value={stats.reviews.value} suffix={stats.reviews.suffix} label={stats.reviews.label} icon={FiStar} />
                </>
              )
            )}
          </div>
        </div>
      </section>

      {/* 3. Featured Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle 
          title="Browse Curated Categories" 
          subtitle="Quickly navigate through our top categories containing modern technical specifications and classic text files."
        />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-48 bg-border-main/20 animate-pulse rounded-2xl"></div>
            ))
          ) : (
            categories.map((cat, idx) => (
              <CategoryCard key={cat.id} category={cat} delay={idx * 0.05} />
            ))
          )}
        </div>
      </section>

      {/* 4. Featured Books Grid */}
      <section id="featured" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border-main/40">
        <div className="flex flex-col sm:flex-row justify-between items-baseline mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-text-main tracking-tight">Featured Masterpieces</h2>
            <p className="text-sm text-text-muted mt-2">Handpicked titles curated by our principal editors.</p>
          </div>
          <Link
            to="/books"
            className="text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1 hover:underline"
          >
            View all library items <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-96 bg-border-main/20 animate-pulse rounded-2xl"></div>
            ))
          ) : (
            featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} onQuickView={setSelectedBook} />
            ))
          )}
        </div>
      </section>

      {/* 5. Best Sellers Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border-main/40">
        <SectionTitle 
          title="Best Sellers" 
          subtitle="The highest-selling books chosen by thousands of developers and professionals around the globe."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-96 bg-border-main/20 animate-pulse rounded-2xl"></div>
            ))
          ) : (
            bestSellers.map((book) => (
              <BookCard key={book.id} book={book} onQuickView={setSelectedBook} />
            ))
          )}
        </div>
      </section>

      {/* 6. Trending Books Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border-main/40">
        <SectionTitle 
          title="Trending Now" 
          subtitle="Discover publications experiencing a surge in readership and high praise this week."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-96 bg-border-main/20 animate-pulse rounded-2xl"></div>
            ))
          ) : (
            trendingBooks.map((book) => (
              <BookCard key={book.id} book={book} onQuickView={setSelectedBook} />
            ))
          )}
        </div>
      </section>

      {/* 7. New Arrivals Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border-main/40">
        <SectionTitle 
          title="New Arrivals" 
          subtitle="Explore the latest literature additions to our catalog directly off the press."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-96 bg-border-main/20 animate-pulse rounded-2xl"></div>
            ))
          ) : (
            newArrivals.map((book) => (
              <BookCard key={book.id} book={book} onQuickView={setSelectedBook} />
            ))
          )}
        </div>
      </section>

      {/* 8. Why Choose BookStore Section */}
      <section className="py-20 bg-bg-surface border-y border-border-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            title="Why Choose BookStore" 
            subtitle="Providing a premium digital purchasing workflow optimized for quality and scale."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 space-y-4">
              <div className="inline-flex p-4 bg-primary/10 text-primary rounded-2xl">
                <FiTruck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-text-main">Free Express Shipping</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Enjoy complimentary express delivery on orders above $35. Packaged in custom secure boxes.
              </p>
            </div>
            
            <div className="text-center p-6 space-y-4">
              <div className="inline-flex p-4 bg-primary/10 text-primary rounded-2xl">
                <FiShield className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-text-main">Secure Shopping</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Stripe integrated gateway. We support multi-factor auth and direct PCI compliant checkouts.
              </p>
            </div>

            <div className="text-center p-6 space-y-4">
              <div className="inline-flex p-4 bg-primary/10 text-primary rounded-2xl">
                <FiBookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-text-main">Premium Collection</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Hand-curated libraries from MIT, O'Reilly, and Harper Collins. Only the finest books.
              </p>
            </div>

            <div className="text-center p-6 space-y-4">
              <div className="inline-flex p-4 bg-primary/10 text-primary rounded-2xl">
                <FiRotateCcw className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-text-main">Easy returns</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Return undamaged volumes within 30 days for a full refund. Generate shipping labels in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Customer Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle 
          title="What Our Readers Say" 
          subtitle="Trusted by lead frontend engineers, product designers, and technical writers worldwide."
        />

        <div className="relative max-w-4xl mx-auto">
          {loading ? (
            <div className="h-64 bg-border-main/20 animate-pulse rounded-3xl"></div>
          ) : (
            testimonials.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Previous Button */}
                <div className="md:col-span-1 hidden md:flex justify-end">
                  <button 
                    onClick={handlePrevTestimonial}
                    className="p-3 bg-bg-surface border border-border-main rounded-xl hover:text-primary transition-colors cursor-pointer"
                  >
                    <FiChevronLeft className="w-6 h-6" />
                  </button>
                </div>

                {/* Slider View */}
                <div className="md:col-span-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={testimonialIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TestimonialCard testimonial={testimonials[testimonialIndex]} />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Next Button */}
                <div className="md:col-span-1 hidden md:flex justify-start">
                  <button 
                    onClick={handleNextTestimonial}
                    className="p-3 bg-bg-surface border border-border-main rounded-xl hover:text-primary transition-colors cursor-pointer"
                  >
                    <FiChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile indicators */}
                <div className="md:hidden flex justify-center gap-4 mt-6">
                  <button 
                    onClick={handlePrevTestimonial}
                    className="p-2 border border-border-main rounded-lg text-text-main"
                  >
                    <FiChevronLeft />
                  </button>
                  <span className="text-xs font-bold text-text-muted mt-2">
                    {testimonialIndex + 1} / {testimonials.length}
                  </span>
                  <button 
                    onClick={handleNextTestimonial}
                    className="p-2 border border-border-main rounded-lg text-text-main"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* 10. Newsletter Subscription Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto border-t border-border-main/40">
        <div className="glassmorphism border border-border-main rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10 space-y-6">
            <div className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl">
              <FiMail className="w-8 h-8" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-main">
              Subscribe to the Bookstore Digest
            </h2>
            <p className="text-text-muted max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
              Stay updated on new releases from MIT Press, O'Reilly updates, coupon codes, and curated developer roadmaps.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); toast.success("Subscribed successfully!"); }}>
              <input
                type="email"
                placeholder="you@company.com"
                className="flex-1 bg-bg-app border border-border-main rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer"
              >
                Join Digest
              </button>
            </form>
          </div>
          <div className="absolute -z-10 w-96 h-96 rounded-full bg-secondary/10 blur-3xl -top-20 -right-20"></div>
          <div className="absolute -z-10 w-96 h-96 rounded-full bg-primary/10 blur-3xl -bottom-20 -left-20"></div>
        </div>
      </section>

      {/* 11. FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border-main/40">
        <SectionTitle 
          title="Frequently Asked Questions" 
          subtitle="Answers to common inquiries regarding shipments, security checks, and ebook access codes."
        />
        {loading ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-16 bg-border-main/20 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <FAQ faqs={faqs} />
        )}
      </section>

      {/* 12. Quick View Drawer Overlay */}
      <QuickViewModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
}
