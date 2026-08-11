import React from 'react';
import { Heart, Star } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { getPosterUrl, getYear, formatRating } from '../utils/helpers';

export function MovieCard({ movie, onClick }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(movie.id);

  const onHeartClick = (e) => {
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const poster = getPosterUrl(movie.poster_path);
  const year = getYear(movie.release_date);
  const rating = formatRating(movie.vote_average);

  return (
    <div className="movie-card animate-fade-in" onClick={() => onClick && onClick(movie)}>
      <div className="poster-wrapper">
        <img
          src={poster}
          alt={movie.title}
          className="poster-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80';
          }}
        />
        <button
          className={`card-overlay-btn ${active ? 'active' : ''}`}
          onClick={onHeartClick}
          title={active ? 'Remove from favorites' : 'Add to favorites'}
          aria-label="Favorite button"
        >
          <Heart size={18} fill={active ? 'white' : 'transparent'} color="white" />
        </button>
      </div>

      <div className="movie-info">
        <h3 className="movie-title" title={movie.title}>{movie.title}</h3>
        <div className="movie-meta">
          <span>{year}</span>
          <div className="rating-badge">
            <Star size={13} fill="#FFC107" color="#FFC107" />
            <span>{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
