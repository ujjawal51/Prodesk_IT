'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

export function SearchBar({ value, onChange, onClear, placeholder = 'Search titles, genres, keywords...' }) {
  return (
    <div className="search-container">
      <Search size={20} className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search movies"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="search-clear-btn"
          title="Clear search"
          aria-label="Clear search input"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
