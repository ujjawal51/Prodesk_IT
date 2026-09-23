'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Film, Heart, Sparkles, Settings, Sun, Moon, Layers } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectFavoritesCount, selectIsFavoritesHydrated } from '../redux/slices/favoritesSlice';
import { toggleTheme, selectThemeMode } from '../redux/slices/themeSlice';
import { ReduxDevToolsGuideModal } from './ReduxDevToolsGuideModal';

export function Navbar({ onOpenMoodMatcher, onOpenApiKeyModal }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // Redux Global State selectors
  const favoritesCount = useAppSelector(selectFavoritesCount);
  const isHydrated = useAppSelector(selectIsFavoritesHydrated);
  const themeMode = useAppSelector(selectThemeMode);

  const [isDevToolsGuideOpen, setIsDevToolsGuideOpen] = useState(false);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <>
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
                  background: 'rgba(255, 215, 0, 0.08)',
                }}
              >
                <Sparkles size={16} color="#FFD700" />
                AI Mood Matcher
              </button>
            </li>

            {/* Redux DevTools Helper Trigger */}
            <li>
              <button
                type="button"
                className="nav-link btn-devtools-info"
                onClick={() => setIsDevToolsGuideOpen(true)}
                title="Sprint 10 Redux DevTools QA Verification Guide"
              >
                <Layers size={16} />
                <span>DevTools</span>
              </button>
            </li>

            {/* SPRINT 10 Phase 3: Global Theme Switcher (Dark/Light Mode) */}
            <li>
              <button
                type="button"
                className="theme-toggle-btn"
                onClick={handleToggleTheme}
                title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode (Redux Global State)`}
                aria-label="Toggle theme"
              >
                {themeMode === 'dark' ? (
                  <Sun size={18} color="#FFD700" />
                ) : (
                  <Moon size={18} color="#764ABC" />
                )}
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

      <ReduxDevToolsGuideModal
        isOpen={isDevToolsGuideOpen}
        onClose={() => setIsDevToolsGuideOpen(false)}
      />
    </>
  );
}

export default Navbar;
