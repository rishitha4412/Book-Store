import React from 'react';
import { FiDollarSign, FiStar, FiFilter, FiCheckCircle } from 'react-icons/fi';

export default function FilterSidebar({ 
  filters, 
  onFilterChange, 
  metadata, 
  categories, 
  onClearFilters 
}) {
  const handleCheckboxChange = (field, value) => {
    const activeValues = filters[field] ? [filters[field]] : []; // Handle string fallback
    // Or if filters[field] is array. In our design, we filter by one specific value at a time for simplicity and routing matching
    // Let's support single selections or toggles for simplicity:
    const currentValue = filters[field];
    const newValue = currentValue === value ? '' : value;
    onFilterChange({ [field]: newValue, page: 1 });
  };

  const handlePriceChange = (e) => {
    onFilterChange({ maxPrice: parseFloat(e.target.value), page: 1 });
  };

  const handleRatingSelect = (ratingVal) => {
    const newValue = filters.rating === ratingVal ? '' : ratingVal;
    onFilterChange({ rating: newValue, page: 1 });
  };

  const handleInStockToggle = (e) => {
    onFilterChange({ inStock: e.target.checked ? true : '', page: 1 });
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-bg-surface border border-border-main rounded-3xl p-6 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-main/50 pb-4">
        <h3 className="font-extrabold text-text-main text-base sm:text-lg flex items-center gap-2">
          <FiFilter className="text-primary" /> Filters
        </h3>
        <button
          onClick={onClearFilters}
          className="text-xs font-bold text-primary hover:underline hover:text-primary-hover cursor-pointer"
        >
          Reset All
        </button>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold text-text-main uppercase tracking-wider">Browse Category</h4>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => onFilterChange({ category: '', page: 1 })}
            className={`text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              !filters.category
                ? 'bg-primary/5 text-primary'
                : 'text-text-muted hover:bg-bg-app hover:text-text-main'
            }`}
          >
            All Genres
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ category: cat.slug, page: 1 })}
              className={`text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all truncate ${
                filters.category === cat.slug
                  ? 'bg-primary/5 text-primary'
                  : 'text-text-muted hover:bg-bg-app hover:text-text-main'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      {metadata?.maxPrice && (
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-text-main uppercase tracking-wider">Max Budget</h4>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={metadata.maxPrice}
              value={filters.maxPrice !== undefined ? filters.maxPrice : metadata.maxPrice}
              onChange={handlePriceChange}
              className="w-full accent-primary h-1.5 bg-border-main rounded-lg cursor-pointer"
            />
            <div className="flex justify-between items-center text-xs font-bold text-text-muted">
              <span>$0</span>
              <span className="text-primary font-black bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/10">
                Under ${(filters.maxPrice !== undefined ? filters.maxPrice : metadata.maxPrice).toFixed(2)}
              </span>
              <span>${metadata.maxPrice}</span>
            </div>
          </div>
        </div>
      )}

      {/* Authors list selection */}
      {metadata?.authors?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-text-main uppercase tracking-wider">Authors</h4>
          <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
            {metadata.authors.map((auth, index) => (
              <label key={index} className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm group text-text-muted hover:text-text-main">
                <input
                  type="checkbox"
                  checked={filters.author === auth}
                  onChange={() => handleCheckboxChange('author', auth)}
                  className="w-4 h-4 text-primary border-border-main rounded focus:ring-primary focus:ring-2 accent-primary"
                />
                <span className={`truncate font-medium transition-colors ${filters.author === auth ? 'text-primary font-bold' : ''}`}>
                  {auth}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Publishers list selection */}
      {metadata?.publishers?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-text-main uppercase tracking-wider">Publishers</h4>
          <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
            {metadata.publishers.map((pub, index) => (
              <label key={index} className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm group text-text-muted hover:text-text-main">
                <input
                  type="checkbox"
                  checked={filters.publisher === pub}
                  onChange={() => handleCheckboxChange('publisher', pub)}
                  className="w-4 h-4 text-primary border-border-main rounded focus:ring-primary focus:ring-2 accent-primary"
                />
                <span className={`truncate font-medium transition-colors ${filters.publisher === pub ? 'text-primary font-bold' : ''}`}>
                  {pub}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Languages list selection */}
      {metadata?.languages?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-text-main uppercase tracking-wider">Language</h4>
          <div className="space-y-2">
            {metadata.languages.map((lang, index) => (
              <label key={index} className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm group text-text-muted hover:text-text-main">
                <input
                  type="checkbox"
                  checked={filters.language === lang}
                  onChange={() => handleCheckboxChange('language', lang)}
                  className="w-4 h-4 text-primary border-border-main rounded focus:ring-primary focus:ring-2 accent-primary"
                />
                <span className={`font-medium transition-colors ${filters.language === lang ? 'text-primary font-bold' : ''}`}>
                  {lang}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Rating scale */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold text-text-main uppercase tracking-wider">Reader Ratings</h4>
        <div className="flex flex-col gap-1.5">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => handleRatingSelect(stars)}
              className={`flex items-center gap-2 text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filters.rating === stars
                  ? 'bg-primary/5 text-primary'
                  : 'text-text-muted hover:bg-bg-app hover:text-text-main'
              }`}
            >
              <span className="flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <FiStar key={idx} className={`w-3.5 h-3.5 ${idx < stars ? 'fill-current' : 'text-border-main'}`} />
                ))}
              </span>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stock Availability */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-extrabold text-text-main uppercase tracking-wider">Availability</h4>
        <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-text-muted hover:text-text-main">
          <input
            type="checkbox"
            checked={!!filters.inStock}
            onChange={handleInStockToggle}
            className="w-4 h-4 text-primary border-border-main rounded focus:ring-primary focus:ring-2 accent-primary"
          />
          <span className="font-semibold flex items-center gap-1">
            <FiCheckCircle className="text-green-500" /> Only In Stock
          </span>
        </label>
      </div>

    </aside>
  );
}
