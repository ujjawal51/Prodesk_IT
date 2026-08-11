import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { MovieGrid } from '../components/MovieGrid';
import { MovieModal } from '../components/MovieModal';
import { useMovies } from '../hooks/useMovies';
import { GENRES } from '../utils/constants';
import { Sparkles, Info, Play } from 'lucide-react';

export function HomePage({ onOpenMoodMatcher, externalQuery }) {
  const {
    movies,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    loading,
    loadingMore,
    hasMore,
    isFallback,
    loadMore
  } = useMovies();

  const [activeMovie, setActiveMovie] = useState(null);

  useEffect(() => {
    if (externalQuery) {
      setSearchQuery(externalQuery);
    }
  }, [externalQuery, setSearchQuery]);

  return (
    <div className="home-page animate-fade-in">
      <div className="hero-banner">
        <div className="hero-bg-overlay" />
        <div className="hero-content">
          <span style={{
            background: 'var(--accent-red)',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '1.5px',
            padding: '4px 10px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '0.75rem'
          }}>
            Cine-Stream Original
          </span>
          <h1 className="hero-title">Unlimited Movies, TV Shows & AI Discovery</h1>
          <p className="hero-description">
            Experience next-generation streaming discovery with 500ms debounced search, native infinite scrolling, and AI-powered mood matching.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={onOpenMoodMatcher}>
              <Sparkles size={18} />
              Try AI Mood Matcher
            </button>
            <a href="#explore-grid" className="btn btn-secondary">
              <Play size={18} fill="white" />
              Browse Popular
            </a>
          </div>
        </div>
      </div>

      {isFallback && (
        <div style={{
          background: 'rgba(255, 193, 7, 0.12)',
          border: '1px solid rgba(255, 193, 7, 0.3)',
          color: '#FFC107',
          padding: '0.75rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Info size={18} />
          <span>
            Operating in offline fallback mode. Click Settings in top navigation to insert your live TMDB API key.
          </span>
        </div>
      )}

      <div id="explore-grid" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800 }}>
            {searchQuery ? `Results for "${searchQuery}"` : 'Trending Now'}
          </h2>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
          {GENRES.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(g.id)}
              style={{
                background: selectedGenre === g.id ? 'var(--accent-red)' : 'var(--glass-bg)',
                color: selectedGenre === g.id ? 'white' : 'var(--text-secondary)',
                border: selectedGenre === g.id ? 'none' : '1px solid var(--glass-border)',
                padding: '0.45rem 1.1rem',
                borderRadius: '20px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      <MovieGrid
        movies={movies}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onSelect={(movie) => setActiveMovie(movie)}
      />

      {activeMovie && (
        <MovieModal
          movie={activeMovie}
          onClose={() => setActiveMovie(null)}
        />
      )}
    </div>
  );
}
