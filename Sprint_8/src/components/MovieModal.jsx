import React, { useEffect } from 'react';
import { X, Star, Heart, Calendar, Play } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { getPosterUrl, getBackdropUrl, getYear, formatRating, getGenres } from '../utils/helpers';

export function MovieModal({ movie, onClose }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!movie) return null;

  const active = isFavorite(movie.id);
  const poster = getPosterUrl(movie.poster_path);
  const backdrop = getBackdropUrl(movie.backdrop_path || movie.poster_path);
  const year = getYear(movie.release_date);
  const rating = formatRating(movie.vote_average);
  const genres = getGenres(movie.genre_ids);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div style={{ position: 'relative', height: '320px', width: '100%' }}>
          <img
            src={backdrop}
            alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, var(--bg-card) 5%, transparent 95%)'
          }} />
        </div>

        <div style={{ padding: '2rem', marginTop: '-60px', position: 'relative', zIndex: 10, display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ width: '180px', flexShrink: 0 }}>
            <img
              src={poster}
              alt={movie.title}
              style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', border: '1px solid var(--glass-border)' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: '280px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {movie.title}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--star-yellow)', fontWeight: 700 }}>
                <Star size={16} fill="#FFC107" />
                <span>{rating} / 10</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={16} />
                <span>{year}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {genres.map((g, i) => (
                <span
                  key={i}
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {g}
                </span>
              ))}
            </div>

            <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
              Overview
            </h4>
            <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              {movie.overview || 'No description available for this title.'}
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => alert(`Playing trailer for "${movie.title}"`)}>
                <Play size={18} fill="white" />
                Watch Trailer
              </button>
              <button
                className={`btn ${active ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => toggleFavorite(movie)}
                style={{ backgroundColor: active ? '#E50914' : undefined }}
              >
                <Heart size={18} fill={active ? 'white' : 'transparent'} />
                {active ? 'Favorited' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
