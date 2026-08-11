import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Heart, Sparkles, Settings } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

export function Navbar({ onOpenMoodMatcher, onOpenApiKeyModal }) {
  const location = useLocation();
  const { favoritesCount } = useFavorites();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Film size={28} color="#E50914" />
        <span className="navbar-logo-text">CINE-STREAM</span>
      </Link>

      <ul className="nav-links">
        <li>
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Explore
          </Link>
        </li>
        <li>
          <Link
            to="/favorites"
            className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}
          >
            <Heart size={18} fill={location.pathname === '/favorites' ? '#E50914' : 'transparent'} color="#E50914" />
            Favorites
            {favoritesCount > 0 && <span className="badge">{favoritesCount}</span>}
          </Link>
        </li>
        <li>
          <button
            className="nav-link btn-secondary"
            onClick={onOpenMoodMatcher}
            style={{ border: '1px solid rgba(229, 9, 20, 0.4)', color: '#FFD700', cursor: 'pointer' }}
          >
            <Sparkles size={18} color="#FFD700" />
            AI Mood Matcher
          </button>
        </li>
        <li>
          <button
            className="nav-link"
            onClick={onOpenApiKeyModal}
            title="Settings"
            style={{ cursor: 'pointer', background: 'transparent', border: 'none' }}
          >
            <Settings size={20} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
