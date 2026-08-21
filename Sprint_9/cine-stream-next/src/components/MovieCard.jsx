'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { getPosterUrl, getYear, formatRating } from '../utils/helpers';

export function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(movie.id);
  const [imgSrc, setImgSrc] = useState(() => getPosterUrl(movie.poster_path));

  const onHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const year = getYear(movie.release_date);
  const rating = formatRating(movie.vote_average);

  return (
    <div className="movie-card animate-fade-in">
      <Link href={`/movie/${movie.id}`} className="movie-card-link">
        <div className="poster-wrapper">
          <Image
            src={imgSrc}
            alt={movie.title || 'Movie Poster'}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
            className="poster-img"
            onError={() => {
              setImgSrc('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80');
            }}
          />
          <button
            type="button"
            className={`card-overlay-btn ${active ? 'active' : ''}`}
            onClick={onHeartClick}
            title={active ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle Favorite"
          >
            <Heart
              size={18}
              fill={active ? '#FFFFFF' : 'transparent'}
              color="#FFFFFF"
            />
          </button>
        </div>

        <div className="movie-info">
          <h3 className="movie-title" title={movie.title}>
            {movie.title}
          </h3>
          <div className="movie-meta">
            <span style={{ color: 'var(--text-secondary)' }}>{year}</span>
            <div className="rating-badge">
              <Star size={13} fill="#FFC107" color="#FFC107" />
              <span>{rating}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
