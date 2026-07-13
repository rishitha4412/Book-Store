import React from 'react';
import { FiX } from 'react-icons/fi';

export default function ActiveFilterChips({ filters, onRemoveFilter, onClearAll, metadata }) {
  const activeChips = [];

  // Construct active chips dynamically
  if (filters.category) {
    activeChips.push({ field: 'category', label: `Category: ${filters.category}` });
  }
  if (filters.author) {
    activeChips.push({ field: 'author', label: `Author: ${filters.author}` });
  }
  if (filters.publisher) {
    activeChips.push({ field: 'publisher', label: `Publisher: ${filters.publisher}` });
  }
  if (filters.language) {
    activeChips.push({ field: 'language', label: `Language: ${filters.language}` });
  }
  if (filters.rating) {
    activeChips.push({ field: 'rating', label: `Rating: ${filters.rating}+ Stars` });
  }
  if (filters.inStock) {
    activeChips.push({ field: 'inStock', label: 'In Stock Only' });
  }
  if (filters.maxPrice !== undefined && metadata?.maxPrice && filters.maxPrice < metadata.maxPrice) {
    activeChips.push({ field: 'maxPrice', label: `Price: Under $${filters.maxPrice}` });
  }

  if (activeChips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-xs font-bold text-text-muted mr-1">Active Filters:</span>
      
      {activeChips.map((chip, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary border border-primary/10 rounded-full text-xs font-semibold"
        >
          {chip.label}
          <button
            onClick={() => onRemoveFilter(chip.field)}
            className="p-0.5 hover:bg-primary/10 rounded-full text-primary transition-colors cursor-pointer"
            title={`Remove ${chip.field}`}
          >
            <FiX className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        onClick={onClearAll}
        className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline cursor-pointer ml-1"
      >
        Clear All
      </button>
    </div>
  );
}
