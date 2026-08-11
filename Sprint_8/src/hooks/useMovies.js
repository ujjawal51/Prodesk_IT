import { useState, useEffect, useCallback } from 'react';
import { fetchPopularMovies, searchMovies } from '../services/tmdbApi';
import { useDebounce } from './useDebounce';

export function useMovies() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 500);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  const loadData = useCallback(async (q, pageNum, reset = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      let res;
      if (q && q.trim() !== '') {
        res = await searchMovies(q, pageNum);
      } else {
        res = await fetchPopularMovies(pageNum);
      }

      setIsFallback(res.isFallback || false);
      setTotalPages(res.totalPages || 1);

      let items = res.results || [];

      if (selectedGenre !== 'all') {
        const id = Number(selectedGenre);
        items = items.filter(m => m.genre_ids && m.genre_ids.includes(id));
      }

      setMovies(prev => {
        if (reset || pageNum === 1) return items;
        const set = new Set(prev.map(m => m.id));
        const unique = items.filter(m => !set.has(m.id));
        return [...prev, ...unique];
      });

    } catch (err) {
      console.error(err);
      setError('Failed to fetch movies.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedGenre]);

  useEffect(() => {
    setPage(1);
    loadData(debouncedQuery, 1, true);
  }, [debouncedQuery, selectedGenre, loadData]);

  useEffect(() => {
    if (page > 1) {
      loadData(debouncedQuery, page, false);
    }
  }, [page, debouncedQuery, loadData]);

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && page < totalPages) {
      setPage(prev => prev + 1);
    }
  }, [loading, loadingMore, page, totalPages]);

  return {
    movies,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    page,
    hasMore: page < totalPages,
    loading,
    loadingMore,
    error,
    isFallback,
    loadMore
  };
}
