import React, { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { MovieCard } from '../components/MovieCard';
import { MovieModal } from '../components/MovieModal';
import { Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FavoritesPage() {
  const { favorites } = useFavorites();
  const [query, setQuery] = useState('');
  const [activeMovie, setActiveMovie] = useState(null);

  const list = favorites.filter(m =>
    m.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="favorites-page animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <Heart size={28} color="#E50914" fill="#E50914" />
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800 }}>
              My Favorites
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Saved items synced with browser localStorage. Total: {favorites.length} movies.
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="search-container" style={{ maxWidth: '350px' }}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Filter saved favorites..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '5rem 1rem',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--glass-border)'
        }}>
          <Heart size={54} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Your Favorites list is empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Click the heart icon on any movie card or modal to save it here.
          </p>
          <Link to="/" className="btn btn-primary">
            Explore Movies
          </Link>
        </div>
      ) : (
        <div className="movie-grid">
          {list.map((m) => (
            <div key={m.id} style={{ position: 'relative' }}>
              <MovieCard movie={m} onClick={(item) => setActiveMovie(item)} />
            </div>
          ))}
        </div>
      )}

      {activeMovie && (
        <MovieModal
          movie={activeMovie}
          onClose={() => setActiveMovie(null)}
        />
      )}
    </div>
  );
}
