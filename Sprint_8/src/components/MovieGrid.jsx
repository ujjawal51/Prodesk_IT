import React from 'react';
import { MovieCard } from './MovieCard';
import { SkeletonCard } from './SkeletonCard';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { Film } from 'lucide-react';

export function MovieGrid({ movies, loading, loadingMore, hasMore, onLoadMore, onSelect }) {
  const bottomRef = useInfiniteScroll(onLoadMore, loading || loadingMore, hasMore);

  if (loading && (!movies || movies.length === 0)) {
    return (
      <div className="movie-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!loading && (!movies || movies.length === 0)) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
        <Film size={48} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
        <h2>No movies found</h2>
        <p>Try searching for a different title or select another genre.</p>
      </div>
    );
  }

  return (
    <>
      <div className="movie-grid">
        {movies.map((m) => (
          <MovieCard
            key={`${m.id}-${m.title}`}
            movie={m}
            onClick={onSelect}
          />
        ))}

        {loadingMore && Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={`more-${i}`} />
        ))}
      </div>

      <div ref={bottomRef} className="sentinel-trigger">
        {loadingMore && <div className="spinner" />}
      </div>
    </>
  );
}
