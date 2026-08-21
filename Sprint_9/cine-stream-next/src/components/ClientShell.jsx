'use client';

import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MoodMatcher } from './MoodMatcher';
import { ApiKeyModal } from './ApiKeyModal';
import { FavoritesProvider } from '../context/FavoritesContext';

export function ClientShell({ children }) {
  const [isMoodOpen, setIsMoodOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [activeMoodQuery, setActiveMoodQuery] = useState('');

  const handleApplyMood = (query) => {
    setActiveMoodQuery(query);
    // If on a subpage, navigate to explore
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.location.href = `/?mood=${encodeURIComponent(query)}`;
    }
  };

  return (
    <FavoritesProvider>
      <div className="app-container">
        <Navbar
          onOpenMoodMatcher={() => setIsMoodOpen(true)}
          onOpenApiKeyModal={() => setIsApiKeyOpen(true)}
        />

        <main className="main-content">
          {children}
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
    </FavoritesProvider>
  );
}
