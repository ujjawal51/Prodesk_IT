'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Search, ArrowLeft, Trash2, Film, Sparkles } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { MovieCard } from '../../components/MovieCard';

export default function FavoritesPage() {
  const { favorites, favoritesCount, isHydrated } = useFavorites();
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = favorites.filter((m) =>
    m.title.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ minHeight: '65vh' }}>
      {/* Top Breadcrumb & Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <div style={{ background: 'rgba(229, 9, 20, 0.2)', padding: '8px', borderRadius: '10px' }}>
              <Heart size={24} fill="#E50914" color="#E50914" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
              My Saved Favorites
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Titles persisted locally in your browser workspace.
          </p>
        </div>

        <Link href="/" className="btn btn-secondary">
          <ArrowLeft size={16} /> Explore More Titles
        </Link>
      </div>

      {/* Filter Search within favorites if favorites exist */}
      {isHydrated && favorites.length > 0 && (
        <div style={{ maxWidth: '400px', marginBottom: '2rem' }}>
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search saved favorites..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Favorites Listing */}
      {!isHydrated ? (
        <div className="movie-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton" style={{ height: '340px' }} />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="empty-state-box animate-fade-in" style={{ padding: '5rem 2rem' }}>
          <div style={{ background: 'rgba(229, 9, 20, 0.1)', padding: '1.25rem', borderRadius: '50%', marginBottom: '1.25rem' }}>
            <Heart size={48} color="#E50914" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>
            Your Favorites list is empty
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Explore our curated catalog or use the AI Mood Matcher to find movies and tap the heart icon to save them here.
          </p>
          <Link href="/" className="btn btn-primary">
            <Film size={18} /> Browse Movie Catalog
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state-box animate-fade-in">
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            No saved titles match &ldquo;{filterQuery}&rdquo;.
          </p>
          <button type="button" className="btn btn-secondary" onClick={() => setFilterQuery('')}>
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="movie-grid">
          {filtered.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
