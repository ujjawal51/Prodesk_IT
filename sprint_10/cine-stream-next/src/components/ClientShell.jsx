'use client';

import React, { useState, useEffect } from 'react';
import { ReduxProvider } from './ReduxProvider';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MoodMatcher } from './MoodMatcher';
import { ApiKeyModal } from './ApiKeyModal';
import { useAppSelector } from '../redux/hooks';
import { selectThemeMode } from '../redux/slices/themeSlice';

/**
 * Shell Body synchronizes HTML DOM with the Redux Theme Slice
 */
function ShellBody({ children }) {
  const themeMode = useAppSelector(selectThemeMode);
  const [isMoodOpen, setIsMoodOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [activeMoodQuery, setActiveMoodQuery] = useState('');

  // SPRINT 10 Phase 3: Global Theming DOM Sync
  // Applies data-theme attribute and dark/light classes to root document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeMode);
      if (themeMode === 'light') {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark-theme');
      } else {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
      }
    }
  }, [themeMode]);

  const handleApplyMood = (query) => {
    setActiveMoodQuery(query);
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.location.href = `/?mood=${encodeURIComponent(query)}`;
    }
  };

  return (
    <div className={`app-container theme-${themeMode}`}>
      <Navbar
        onOpenMoodMatcher={() => setIsMoodOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyOpen(true)}
      />

      <main className="main-content">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              moodQuery: activeMoodQuery,
              onClearMoodQuery: () => setActiveMoodQuery(''),
            });
          }
          return child;
        })}
      </main>

      <Footer />

      <MoodMatcher
        isOpen={isMoodOpen}
        onClose={() => setIsMoodOpen(false)}
        onApplyMoodQuery={handleApplyMood}
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
      />
    </div>
  );
}

/**
 * Sprint 10 Track A: Phase 1 Global Store Initialization
 * Wraps entire client shell in Redux Provider.
 */
export function ClientShell({ children }) {
  return (
    <ReduxProvider>
      <ShellBody>{children}</ShellBody>
    </ReduxProvider>
  );
}

export default ClientShell;
