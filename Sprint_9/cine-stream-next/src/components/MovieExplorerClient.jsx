'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SearchBar } from './SearchBar';
import { MovieCard } from './MovieCard';
import { SkeletonGrid } from './SkeletonGrid';
import { useDebounce } from '../hooks/useDebounce';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { searchMoviesClient, fetchPopularMoviesClient } from '../services/tmdbClient';
import { GENRES } from '../utils/constants';
import { Film, Filter, AlertCircle, RefreshCw } from 'lucide-react';

export function MovieExplorerClient({ initialMovies = [], initialPage = 1, totalPages = 5, moodQuery = '', onClearMoodQuery }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [movies, setMovies] = useState(initialMovies);
  const [page, setPage] = useState(initialPage);
  const [maxPages, setMaxPages] = useState(totalPages);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Sync moodQuery if set from AI modal
  useEffect(() => {
    if (moodQuery) {
      setSearchTerm(moodQuery);
    }
  }, [moodQuery]);

  // Handle Search & Genre filtering
  const performSearch = useCallback(async (query, genre) => {
    setLoading(true);
    setPage(1);

    try {
      let data;
      if (query.trim()) {
        data = await searchMoviesClient(query, 1);
      } else {
        data = await fetchPopularMoviesClient(1);
      }

      let results = data.results || [];

      // Filter by genre on client if selected
      if (genre !== 'all') {
        const genreId = Number(genre);
        results = results.filter(
          (m) =>
            (m.genre_ids && m.genre_ids.includes(genreId)) ||
            (m.genres && m.genres.some((g) => g.id === genreId))
        );
      }

      setMovies(results);
      setMaxPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error filtering movies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger search when debounced search or genre changes
  useEffect(() => {
    // Avoid double fetch on initial render if pristine
    if (debouncedSearch === '' && selectedGenre === 'all' && !moodQuery) {
      setMovies(initialMovies);
      return;
    }
    performSearch(debouncedSearch, selectedGenre);
  }, [debouncedSearch, selectedGenre, initialMovies, moodQuery, performSearch]);

  // Load next page for infinite scroll
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

      let newResults = data.results || [];
      if (selectedGenre !== 'all') {
        const genreId = Number(selectedGenre);
        newResults = newResults.filter(
          (m) =>
            (m.genre_ids && m.genre_ids.includes(genreId)) ||
            (m.genres && m.genres.some((g) => g.id === genreId))
        );
      }

      setMovies((prev) => {
        const existingIds = new Set(prev.map((m) => String(m.id)));
        const filtered = newResults.filter((m) => !existingIds.has(String(m.id)));
        return [...prev, ...filtered];
      });
      setPage(nextPage);
    } catch (err) {
      console.error('Infinite scroll fetch error:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [page, maxPages, loadingMore, loading, debouncedSearch, selectedGenre]);

  const sentinelRef = useInfiniteScroll(loadMore);

  const handleClear = () => {
    setSearchTerm('');
    if (onClearMoodQuery) onClearMoodQuery();
  };

  return (
    <div className="movie-explorer-container">
      {/* Controls Bar: Search & Genre Filters */}
      <div className="explorer-header">
        <div className="explorer-title-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Filter size={20} color="#E50914" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>
              {searchTerm ? `Results for "${searchTerm}"` : 'Browse Catalogue'}
            </h2>
          </div>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Showing {movies.length} title{movies.length === 1 ? '' : 's'}
          </span>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={handleClear}
          placeholder="Filter by title, genre, keyword..."
        />
      </div>

      {/* Genre Pills */}
      <div className="genre-pills-container">
        {GENRES.map((g) => (
          <button
            key={g.id}
            type="button"
            className={`genre-pill ${String(selectedGenre) === String(g.id) ? 'active' : ''}`}
            onClick={() => setSelectedGenre(g.id)}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Grid Content */}
      {loading ? (
        <SkeletonGrid count={8} />
      ) : movies.length === 0 ? (
        <div className="empty-state-box animate-fade-in">
          <AlertCircle size={48} color="#E50914" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
            No matching titles discovered
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', marginBottom: '1.5rem' }}>
            Try adjusting your search query, switching genre filters, or launch the AI Mood Matcher.
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setSearchTerm('');
              setSelectedGenre('all');
              if (onClearMoodQuery) onClearMoodQuery();
            }}
          >
            <RefreshCw size={16} /> Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Infinite Scroll Sentinel */}
          {page < maxPages && (
            <div ref={sentinelRef} className="sentinel-trigger">
              {loadingMore ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <div className="spinner" />
                  <span>Loading more cinematic titles...</span>
                </div>
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Scroll down to load next batch
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
