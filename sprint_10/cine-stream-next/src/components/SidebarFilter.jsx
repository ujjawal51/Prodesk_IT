'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setSearchQuery,
  setCategory,
  setMinRating,
  setSortBy,
  setReleaseYear,
  resetFilters,
  selectFilter,
  selectActiveFiltersCount,
} from '../redux/slices/filterSlice';
import { GENRES } from '../utils/constants';
import {
  Filter,
  Search,
  Sliders,
  Star,
  RotateCcw,
  Sparkles,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: '🔥 Most Popular' },
  { value: 'vote_average.desc', label: '⭐ Highest Rated' },
  { value: 'release_date.desc', label: '📅 Newest Releases' },
  { value: 'title.asc', label: '🔤 Title (A - Z)' },
];

const YEAR_OPTIONS = [
  { value: 'all', label: 'All Years' },
  { value: '2024', label: '2024 Releases' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
  { value: '2020s', label: '2020 - 2025' },
  { value: 'classic', label: 'Classic Cinema (< 2015)' },
];

export function SidebarFilter({ className = '', onFilterMutated }) {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const activeCount = useAppSelector(selectActiveFiltersCount);

  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [showAllGenres, setShowAllGenres] = useState(false);

  // Genre pills list
  const visibleGenres = showAllGenres ? GENRES : GENRES.slice(0, 10);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
    if (onFilterMutated) onFilterMutated();
  };

  const handleCategorySelect = (genreId) => {
    dispatch(setCategory(String(genreId)));
    if (onFilterMutated) onFilterMutated();
  };

  const handleRatingChange = (e) => {
    dispatch(setMinRating(Number(e.target.value)));
    if (onFilterMutated) onFilterMutated();
  };

  const handleSortChange = (e) => {
    dispatch(setSortBy(e.target.value));
    if (onFilterMutated) onFilterMutated();
  };

  const handleYearChange = (e) => {
    dispatch(setReleaseYear(e.target.value));
    if (onFilterMutated) onFilterMutated();
  };

  const handleReset = () => {
    dispatch(resetFilters());
    if (onFilterMutated) onFilterMutated();
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="mobile-filter-trigger">
        <button
          type="button"
          className="btn btn-secondary mobile-filter-btn"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
        >
          <Sliders size={16} />
          <span>Filters & Sort</span>
          {activeCount > 0 && <span className="filter-badge-counter">{activeCount}</span>}
        </button>
      </div>

      {/* Main Sidebar Filter Container */}
      <aside className={`sidebar-filter-wrapper ${isOpenMobile ? 'mobile-open' : ''} ${className}`}>
        <div className="sidebar-filter-header">
          <div className="sidebar-title-group">
            <Sliders size={20} className="sidebar-icon-glow" />
            <h2 className="sidebar-heading">Filters</h2>
            {activeCount > 0 && (
              <span className="filter-badge-pill" title="Active filters applied in Redux">
                {activeCount} Active
              </span>
            )}
          </div>

          <div className="sidebar-actions">
            {activeCount > 0 && (
              <button
                type="button"
                className="btn-reset-filters"
                onClick={handleReset}
                title="Reset all filters to defaults"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
            <button
              type="button"
              className="btn-close-mobile"
              onClick={() => setIsOpenMobile(false)}
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 1. Keyword Search Field */}
        <div className="filter-section">
          <label className="filter-section-title">
            <Search size={14} /> Search Catalog
          </label>
          <div className="search-field-wrapper">
            <input
              type="text"
              placeholder="Search title, cast..."
              value={filter.searchQuery}
              onChange={handleSearchChange}
              className="sidebar-search-input"
            />
            {filter.searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => dispatch(setSearchQuery(''))}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* 2. Sort By Dropdown */}
        <div className="filter-section">
          <label className="filter-section-title">
            <Layers size={14} /> Sort By
          </label>
          <div className="select-dropdown-wrapper">
            <select
              value={filter.sortBy}
              onChange={handleSortChange}
              className="sidebar-select"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Category / Genre Pills */}
        <div className="filter-section">
          <div className="filter-section-title-between">
            <label className="filter-section-title">
              <Sparkles size={14} /> Category / Genre
            </label>
            <span className="filter-meta-label">
              {filter.category === 'all' ? 'All' : GENRES.find((g) => String(g.id) === String(filter.category))?.name || 'Selected'}
            </span>
          </div>
          <div className="genre-pills-cloud">
            <button
              type="button"
              className={`genre-pill-btn ${filter.category === 'all' ? 'active' : ''}`}
              onClick={() => handleCategorySelect('all')}
            >
              All Genres
            </button>
            {visibleGenres.map((genre) => {
              const isSelected = String(filter.category) === String(genre.id);
              return (
                <button
                  key={genre.id}
                  type="button"
                  className={`genre-pill-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(genre.id)}
                >
                  {genre.name}
                </button>
              );
            })}
          </div>
          {GENRES.length > 10 && (
            <button
              type="button"
              className="btn-toggle-genres"
              onClick={() => setShowAllGenres(!showAllGenres)}
            >
              {showAllGenres ? (
                <>Less genres <ChevronUp size={13} /></>
              ) : (
                <>More genres (+{GENRES.length - 10}) <ChevronDown size={13} /></>
              )}
            </button>
          )}
        </div>

        {/* 4. Minimum Rating Range Slider (0.0 to 10.0) */}
        <div className="filter-section">
          <div className="filter-section-title-between">
            <label className="filter-section-title">
              <Star size={14} className="star-icon" /> Minimum Rating
            </label>
            <span className="rating-value-badge">
              {filter.minRating > 0 ? `${filter.minRating.toFixed(1)}+ Stars` : 'Any Rating'}
            </span>
          </div>
          <div className="range-slider-wrapper">
            <input
              type="range"
              min="0"
              max="9.5"
              step="0.5"
              value={filter.minRating}
              onChange={handleRatingChange}
              className="sidebar-range-input"
            />
            <div className="range-ticks">
              <span>0.0</span>
              <span>5.0</span>
              <span>7.5</span>
              <span>9.5</span>
            </div>
          </div>
        </div>

        {/* 5. Release Era / Year Filter */}
        <div className="filter-section">
          <label className="filter-section-title">
            <Calendar size={14} /> Release Year
          </label>
          <div className="select-dropdown-wrapper">
            <select
              value={filter.releaseYear}
              onChange={handleYearChange}
              className="sidebar-select"
            >
              {YEAR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Redux State Inspector Helper Indicator */}
        <div className="filter-redux-badge">
          <span className="redux-pulse-dot" />
          <span className="redux-indicator-text">
            Synced with <strong>Redux Toolkit</strong> Store
          </span>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {isOpenMobile && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsOpenMobile(false)}
        />
      )}
    </>
  );
}

export default SidebarFilter;
