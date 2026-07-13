import React from 'react';
import { FiSearch, FiRotateCcw } from 'react-icons/fi';

export default function EmptyState({ 
  title = 'No Results Found', 
  description = 'Try adjusting your search keywords or filter settings to find what you are looking for.', 
  onAction 
}) {
  return (
    <div className="text-center py-20 px-4 bg-bg-surface border border-border-main rounded-3xl shadow-sm max-w-lg mx-auto">
      <div className="inline-flex p-5 bg-primary/10 text-primary rounded-3xl mb-6">
        <FiSearch className="w-10 h-10 animate-pulse" />
      </div>
      <h3 className="text-xl font-extrabold text-text-main mb-2">
        {title}
      </h3>
      <p className="text-sm text-text-muted leading-relaxed mb-8">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-primary/15 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        >
          <FiRotateCcw className="w-4 h-4" /> Reset Filters
        </button>
      )}
    </div>
  );
}
