import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiList, FiHome, FiChevronRight, FiSliders } from 'react-icons/fi';

// Services & Hooks
import { bookService } from '../services/bookService';

// UI Components
import SearchBar from '../components/ui/SearchBar';
import FilterSidebar from '../components/ui/FilterSidebar';
import ActiveFilterChips from '../components/ui/ActiveFilterChips';
import BookCard from '../components/ui/BookCard';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import QuickViewModal from '../components/ui/QuickViewModal';

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Layout and view toggles
  const [layout, setLayout] = useState('grid'); // 'grid' | 'list'
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quickViewBook, setQuickViewBook] = useState(null);

  // Sync SearchParams to Filter state object
  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    author: searchParams.get('author') || '',
    publisher: searchParams.get('publisher') || '',
    language: searchParams.get('language') || '',
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : undefined,
    rating: searchParams.get('rating') ? parseInt(searchParams.get('rating')) : undefined,
    inStock: searchParams.get('inStock') === 'true',
    sort: searchParams.get('sort') || 'bestSelling',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 9
  };

  // Fetch filter selections metadata & categories on mount
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [cats, meta] = await Promise.all([
          bookService.getCategories(),
          bookService.getFilterMetadata()
        ]);
        setCategories(cats);
        setMetadata(meta);
      } catch (err) {
        console.error("Failed to load filter metadata", err);
      }
    };
    loadMetadata();
  }, []);

  // Fetch books matching current query parameters
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const result = await bookService.getBooks(filters);
        setBooks(result.books);
        setTotalPages(result.totalPages);
        setTotalCount(result.totalCount);
        
        // Scroll back to top on query updates
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error("Failed fetching books list", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [
    filters.search,
    filters.category,
    filters.author,
    filters.publisher,
    filters.language,
    filters.maxPrice,
    filters.rating,
    filters.inStock,
    filters.sort,
    filters.page
  ]);

  const updateFilters = (newFilters) => {
    setSearchParams((prev) => {
      Object.entries(newFilters).forEach(([key, val]) => {
        if (val === undefined || val === '' || val === null || val === false) {
          prev.delete(key);
        } else {
          prev.set(key, val);
        }
      });
      // Reset page indicator to 1 if user modifies other filters
      if (newFilters.page === undefined) {
        prev.delete('page');
      }
      return prev;
    });
  };

  const handleRemoveSingleFilter = (field) => {
    updateFilters({ [field]: '' });
  };

  const handleClearAllFilters = () => {
    setSearchParams({});
  };

  const handleSortChange = (e) => {
    updateFilters({ sort: e.target.value, page: 1 });
  };

  // Calculate results counters: e.g. "Showing 1–9 of 35 results"
  const getResultsLabel = () => {
    if (totalCount === 0) return 'No results';
    const start = (filters.page - 1) * filters.limit + 1;
    const end = Math.min(filters.page * filters.limit, totalCount);
    return `Showing ${start}–${end} of ${totalCount} results`;
  };

  return (
    <div className="min-h-screen pt-24 pb-20 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-bold text-text-muted mb-6 uppercase tracking-wider">
          <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <FiHome className="w-3.5 h-3.5" /> Home
          </Link>
          <FiChevronRight className="text-border-main" />
          <span className="text-text-main">Browse Books</span>
        </nav>

        {/* Dynamic Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main tracking-tight leading-none">
            {filters.category 
              ? categories.find(c => c.slug === filters.category)?.name || 'Genre Books'
              : 'Our Library Catalog'
            }
          </h1>
          <p className="text-sm text-text-muted mt-2">
            Explore and discover technical guides, startup blueprints, and literary releases.
          </p>
        </div>

        {/* Search Panel Row */}
        <div className="mb-8 max-w-2xl">
          <SearchBar 
            value={filters.search} 
            onChange={(val) => updateFilters({ search: val, page: 1 })} 
          />
        </div>

        {/* Layout grid containing filters sidebar and list output */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onFilterChange={updateFilters}
              metadata={metadata}
              categories={categories}
              onClearFilters={handleClearAllFilters}
            />
          </div>

          {/* Results Area */}
          <div className="flex-grow w-full">
            
            {/* Top Catalog Toolbar (Count, Layout switches, Sorting Dropdown) */}
            <div className="bg-bg-surface border border-border-main rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm text-sm">
              <div className="font-bold text-text-main">
                {getResultsLabel()}
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-text-muted text-xs font-bold uppercase tracking-wider shrink-0">Sort By</span>
                  <select
                    value={filters.sort}
                    onChange={handleSortChange}
                    className="bg-bg-app border border-border-main rounded-xl px-3.5 py-2 text-xs font-semibold text-text-main focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="bestSelling">Best Selling</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="ratingDesc">Highest Rated</option>
                    <option value="titleAsc">Title: A–Z</option>
                  </select>
                </div>

                {/* Mobile Filter toggle button */}
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="lg:hidden p-2 border border-border-main text-text-muted hover:text-text-main rounded-xl flex items-center gap-1.5 font-semibold text-xs"
                >
                  <FiSliders /> Filters
                </button>

                {/* View switcher (Grid/List) */}
                <div className="hidden sm:flex items-center border border-border-main rounded-xl p-0.5 bg-bg-app">
                  <button
                    onClick={() => setLayout('grid')}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      layout === 'grid' 
                        ? 'bg-bg-surface text-primary shadow-sm' 
                        : 'text-text-muted hover:text-text-main'
                    }`}
                    title="Grid view"
                  >
                    <FiGrid className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={() => setLayout('list')}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      layout === 'list' 
                        ? 'bg-bg-surface text-primary shadow-sm' 
                        : 'text-text-muted hover:text-text-main'
                    }`}
                    title="List view"
                  >
                    <FiList className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            <ActiveFilterChips
              filters={filters}
              metadata={metadata}
              onRemoveFilter={handleRemoveSingleFilter}
              onClearAll={handleClearAllFilters}
            />

            {/* Main Books Grid / List panel */}
            {loading ? (
              <div className={layout === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className={`bg-border-main/20 animate-pulse rounded-2xl ${
                    layout === 'grid' ? 'h-96' : 'h-48 w-full'
                  }`}></div>
                ))}
              </div>
            ) : books.length === 0 ? (
              <EmptyState onAction={handleClearAllFilters} />
            ) : (
              <div>
                <motion.div
                  layout
                  className={layout === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "space-y-4"
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {books.map((book) => (
                      <motion.div
                        layout
                        key={book.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                      >
                        <BookCard 
                          book={book} 
                          layout={layout} 
                          onQuickView={setQuickViewBook} 
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination Controls */}
                <Pagination
                  currentPage={filters.page}
                  totalPages={totalPages}
                  onPageChange={(page) => updateFilters({ page })}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer Overlay */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 max-w-full bg-bg-surface p-6 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-extrabold text-lg text-text-main">Filters</span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="px-3 py-1 bg-bg-app border border-border-main rounded-xl text-xs font-bold text-text-muted"
                >
                  Close
                </button>
              </div>
              <FilterSidebar
                filters={filters}
                onFilterChange={(newFilters) => {
                  updateFilters(newFilters);
                  setMobileFiltersOpen(false);
                }}
                metadata={metadata}
                categories={categories}
                onClearFilters={() => {
                  handleClearAllFilters();
                  setMobileFiltersOpen(false);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Quick View Modal Drawer */}
      <QuickViewModal 
        book={quickViewBook} 
        onClose={() => setQuickViewBook(null)} 
      />
    </div>
  );
}
