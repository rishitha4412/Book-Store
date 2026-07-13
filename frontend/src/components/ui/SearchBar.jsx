import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiClock, FiBookOpen, FiArrowRight } from 'react-icons/fi';
import { MOCK_BOOKS } from '../../utils/mockData';

export default function SearchBar({ value, onChange, placeholder = 'Search books, authors, genres...' }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef(null);

  // Load recent searches
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bookstore_recent_searches');
      if (saved && saved !== 'undefined') {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Stale searches detected, clearing:", err);
      localStorage.removeItem('bookstore_recent_searches');
    }
  }, []);

  // Sync internal state to external value changes
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Debounced search trigger (300ms)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query !== value) {
        onChange(query);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, onChange, value]);

  // Handle live suggestions
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const q = query.toLowerCase();
    // Find matching books
    const matches = MOCK_BOOKS.filter(b => 
      b.title.toLowerCase().includes(q) || 
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
    ).slice(0, 5); // Limit to 5 suggestions

    setSuggestions(matches);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery('');
    onChange('');
  };

  const handleSelectSuggestion = (searchString) => {
    setQuery(searchString);
    onChange(searchString);
    saveRecentSearch(searchString);
    setFocused(false);
  };

  const saveRecentSearch = (searchString) => {
    if (!searchString.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter(s => s.toLowerCase() !== searchString.toLowerCase());
      const updated = [searchString, ...filtered].slice(0, 5); // Limit to 5
      localStorage.setItem('bookstore_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onChange(query);
      saveRecentSearch(query);
      setFocused(false);
    }
  };

  const handleRemoveRecent = (e, index) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((_, idx) => idx !== index);
      localStorage.setItem('bookstore_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div ref={containerRef} className="relative w-full z-20">
      {/* Search Input Box */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyPress}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-3.5 bg-bg-surface border border-border-main rounded-2xl text-sm text-text-main focus:outline-none focus:border-primary shadow-sm transition-all focus:ring-1 focus:ring-primary font-medium"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-main hover:bg-bg-app rounded-lg transition-colors cursor-pointer"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions and Recent Searches Panel */}
      <AnimatePresence>
        {focused && (query.trim().length >= 2 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 right-0 mt-2 bg-bg-surface border border-border-main rounded-2xl shadow-xl overflow-hidden py-2"
          >
            {/* Live suggestions */}
            {suggestions.length > 0 && (
              <div className="border-b border-border-main/40 pb-2 mb-2">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-4 py-1">Suggestions</p>
                {suggestions.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => handleSelectSuggestion(book.title)}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-bg-app text-left text-sm text-text-main transition-colors cursor-pointer"
                  >
                    <FiBookOpen className="text-primary w-4 h-4 shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-text-main truncate text-xs sm:text-sm">{book.title}</p>
                      <p className="text-[10px] text-text-muted">By {book.author}</p>
                    </div>
                    <FiArrowRight className="w-4 h-4 text-text-muted ml-auto shrink-0 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-4 py-1">Recent Searches</p>
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectSuggestion(search)}
                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-bg-app text-left text-sm text-text-main transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <FiClock className="text-text-muted w-4 h-4 shrink-0" />
                      <span className="font-medium text-xs sm:text-sm truncate">{search}</span>
                    </div>
                    <button
                      onClick={(e) => handleRemoveRecent(e, index)}
                      className="p-1 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-500/10 cursor-pointer"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
