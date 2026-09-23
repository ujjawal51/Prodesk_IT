'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  selectFilter,
  setSearchQuery,
  resetFilters,
  selectActiveFiltersCount,
} from '../redux/slices/filterSlice';
import { MovieCard } from './MovieCard';
import { SkeletonGrid } from './SkeletonGrid';
import { SidebarFilter } from './SidebarFilter';
import { useDebounce } from '../hooks/useDebounce';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { searchMoviesClient, fetchPopularMoviesClient } from '../services/tmdbClient';
import { GENRES } from '../utils/constants';
import { Film, AlertCircle, RefreshCw, SlidersHorizontal, RotateCcw } from 'lucide-react';

export function MovieExplorerClient({
  initialMovies = [],
  initialPage = 1,
  totalPages = 5,
  moodQuery = '',
  onClearMoodQuery,
}) {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const activeFiltersCount = useAppSelector(selectActiveFiltersCount);

  const [movies, setMovies] = useState(initialMovies);
  const [page, setPage] = useState(initialPage);
  const [maxPages, setMaxPages] = useState(totalPages);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Throttled search text from Redux filter state
  const debouncedSearch = useDebounce(filter.searchQuery, 500);

  // Sync moodQuery if set from AI modal
  useEffect(() => {
    if (moodQuery) {
      dispatch(setSearchQuery(moodQuery));
    }
  }, [moodQuery, dispatch]);

  // Fetch movies from API when search text changes
  const fetchApiMovies = useCallback(async (query) => {
    setLoading(true);
    setPage(1);

    try {
      let data;
      if (query.trim()) {
        data = await searchMoviesClient(query, 1);
      } else {
        data = await fetchPopularMoviesClient(1);
      }
      setMovies(data.results || []);
      setMaxPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching movies in explorer:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedSearch === '' && !moodQuery) {
      setMovies(initialMovies);
      return;
    }
    fetchApiMovies(debouncedSearch);
  }, [debouncedSearch, moodQuery, initialMovies, fetchApiMovies]);

  // SPRINT 10 Phase 3: Re-render Mitigation using useMemo
  // Memoized computation avoids expensive re-filtering & sorting on unrelated DOM events
  const processedMovies = useMemo(() => {
    let list = [...movies];

    // 1. In-memory text matching if already fetched
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (m) =>
          (m.title && m.title.toLowerCase().includes(q)) ||
          (m.overview && m.overview.toLowerCase().includes(q))
      );
    }

    // 2. Category / Genre Filter
    if (filter.category !== 'all') {
      const genreId = Number(filter.category);
      list = list.filter(
        (m) =>
          (m.genre_ids && m.genre_ids.includes(genreId)) ||
          (m.genres && m.genres.some((g) => g.id === genreId))
      );
    }

    // 3. Minimum Rating Filter (0.0 to 10.0 stars)
    if (filter.minRating > 0) {
      list = list.filter((m) => (m.vote_average || 0) >= filter.minRating);
    }

    // 4. Release Year Filter
    if (filter.releaseYear !== 'all') {
      if (filter.releaseYear === 'classic') {
        list = list.filter((m) => {
          const yr = parseInt((m.release_date || '').substring(0, 4), 10);
          return yr && yr < 2015;
        });
      } else if (filter.releaseYear === '2020s') {
        list = list.filter((m) => {
          const yr = parseInt((m.release_date || '').substring(0, 4), 10);
          return yr && yr >= 2020 && yr <= 2025;
        });
      } else {
        const targetYear = filter.releaseYear;
        list = list.filter((m) => (m.release_date || '').startsWith(targetYear));
      }
    }

    // 5. Sorting
    if (filter.sortBy === 'vote_average.desc') {
      list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (filter.sortBy === 'release_date.desc') {
      list.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
    } else if (filter.sortBy === 'title.asc') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else {
      // popularity.desc default
      list.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    return list;
  }, [
    movies,
    debouncedSearch,
    filter.category,
    filter.minRating,
    filter.sortBy,
    filter.releaseYear,
  ]);

  // Load next page for infinite scroll (mitigated via useCallback)
  const loadMore = useCallback(async () => {
    if (loadingMore || loading || page >= maxPages) return;

    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      let data;
      if (debouncedSearch.trim()) {
        data = await searchMoviesClient(debouncedSearch, nextPage);
      } else {
        data = await fetchPopularMoviesClient(nextPage);
      }

      const newResults = data.results || [];

      setMovies((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const uniqueNew = newResults.filter((m) => !existingIds.has(m.id));
        return [...prev, ...uniqueNew];
      });

      setPage(nextPage);
    } catch (err) {
      console.error('Error fetching additional movies:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, loading, page, maxPages, debouncedSearch]);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore: page < maxPages,
    isLoading: loadingMore,
  });

  const handleResetAll = useCallback(() => {
    dispatch(resetFilters());
    if (onClearMoodQuery) onClearMoodQuery();
  }, [dispatch, onClearMoodQuery]);

  return (
    <section className="catalog-layout-container" id="catalog-section">
      {/* Active Mood Pill Banner */}
      {moodQuery && (
        <div className="mood-active-banner animate-fade-in">
          <span>
            ✨ Filtered by Gemini AI Mood: <strong>&ldquo;{moodQuery}&rdquo;</strong>
          </span>
          <button
            type="button"
            className="btn-clear-mood"
            onClick={onClearMoodQuery}
          >
            Clear Mood
          </button>
        </div>
      )}

      {/* Two Column Layout: Multifaceted Sidebar Filter on Left + Movies Grid on Right */}
      <div className="catalog-grid-layout">
        {/* Phase 2: Multifaceted Sidebar Filter */}
        <SidebarFilter />

        {/* Main Content Area */}
        <div className="catalog-main-feed">
          {/* Header Stats Bar */}
          <div className="catalog-feed-header">
            <div>
              <h2 className="catalog-feed-title">
                {filter.category === 'all'
                  ? 'All Cinematic Titles'
                  : `${GENRES.find((g) => String(g.id) === String(filter.category))?.name || 'Filtered'} Movies`}
              </h2>
              <p className="catalog-feed-subtitle">
                Showing {processedMovies.length} title{processedMovies.length === 1 ? '' : 's'}
                {activeFiltersCount > 0 && ` (${activeFiltersCount} Redux filter${activeFiltersCount === 1 ? '' : 's'} active)`}
              </p>
            </div>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleResetAll}
              >
                <RotateCcw size={14} /> Clear All Filters
              </button>
            )}
          </div>

          {/* Grid or Skeleton Loading */}
          {loading ? (
            <SkeletonGrid count={8} />
          ) : processedMovies.length === 0 ? (
            <div className="empty-state-box animate-fade-in">
              <div className="empty-state-icon">
                <Film size={40} color="var(--primary-color)" />
              </div>
              <h3 className="empty-state-title">No matching titles found</h3>
              <p className="empty-state-desc">
                No titles in our catalog match your current Redux filter configuration.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleResetAll}
              >
                <RotateCcw size={16} /> Reset All Filters
              </button>
            </div>
          ) : (
            <div className="movie-grid">
              {processedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}

          {/* Sentinel for Infinite Scroll */}
          <div
            ref={sentinelRef}
            className="sentinel-loader"
            style={{ height: '40px', marginTop: '2rem' }}
          >
            {loadingMore && (
              <div className="loading-spinner-row">
                <RefreshCw size={20} className="spin-animate" />
                <span>Streaming more cinematic titles...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MovieExplorerClient;
