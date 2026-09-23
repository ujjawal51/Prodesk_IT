'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Info, Star, Sparkles } from 'lucide-react';
import { getBackdropUrl, getYear, formatRating } from '../utils/helpers';

export function HeroBanner({ movie, onOpenMoodMatcher }) {
  if (!movie) return null;

  const backdrop = getBackdropUrl(movie.backdrop_path);
  const year = getYear(movie.release_date);
  const rating = formatRating(movie.vote_average);

  return (
    <section className="hero-banner">
      <div className="hero-bg-container">
        <Image
          src={backdrop}
          alt={movie.title || 'Featured Movie'}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
        />
        <div className="hero-gradient-overlay" />
      </div>

      <div className="hero-content animate-fade-in">
        <div className="hero-badges">
          <span className="hero-trending-badge">
            🔥 TRENDING NOW ON CINE-STREAM
          </span>
          <div className="rating-badge">
            <Star size={14} fill="#FFC107" color="#FFC107" />
            <span>{rating} / 10</span>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {year}
          </span>
        </div>

        <h1 className="hero-title">{movie.title}</h1>

        <p className="hero-description">
          {movie.overview || 'Experience high-fidelity cinematic streaming, optimized with Server-Side Rendering and dynamic SEO metadata.'}
        </p>

        <div className="hero-actions">
          <Link href={`/movie/${movie.id}`} className="btn btn-primary">
            <Info size={18} />
            View Movie Details
          </Link>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenMoodMatcher}
            style={{ borderColor: 'rgba(255, 215, 0, 0.4)' }}
          >
            <Sparkles size={18} color="#FFD700" />
            Match by Mood
          </button>
        </div>
      </div>
    </section>
  );
}
