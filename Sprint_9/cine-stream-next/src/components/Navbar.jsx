'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Film, Heart, Sparkles, Settings } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

export function Navbar({ onOpenMoodMatcher, onOpenApiKeyModal }) {
  const pathname = usePathname();
  const { favoritesCount, isHydrated } = useFavorites();

  return (
    <header className="navbar">
      <Link href="/" className="navbar-brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ background: '#E50914', padding: '6px', borderRadius: '8px', display: 'flex' }}>
            <Film size={22} color="#FFFFFF" />
          </div>
          <span className="navbar-logo-text">CINE-STREAM</span>
        </div>
      </Link>

      <nav>
        <ul className="nav-links">
          <li>
            <Link
              href="/"
              className={`nav-link ${pathname === '/' ? 'active' : ''}`}
            >
              Explore
            </Link>
          </li>
          <li>
            <Link
              href="/favorites"
              className={`nav-link ${pathname === '/favorites' ? 'active' : ''}`}
            >
              <Heart
                size={18}
                fill={pathname === '/favorites' ? '#E50914' : 'transparent'}
                color="#E50914"
              />
              Favorites
              {isHydrated && favoritesCount > 0 && (
                <span className="badge">{favoritesCount}</span>
              )}
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="nav-link btn-secondary"
              onClick={onOpenMoodMatcher}
              style={{
                border: '1px solid rgba(229, 9, 20, 0.4)',
                color: '#FFD700',
                cursor: 'pointer',
                background: 'rgba(255, 215, 0, 0.08)'
              }}
            >
              <Sparkles size={16} color="#FFD700" />
              AI Mood Matcher
            </button>
          </li>
          <li>
            <button
              type="button"
              className="nav-link"
              onClick={onOpenApiKeyModal}
              title="API Configuration Settings"
              style={{ cursor: 'pointer', background: 'transparent', border: 'none' }}
              aria-label="Settings"
            >
              <Settings size={19} />
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
