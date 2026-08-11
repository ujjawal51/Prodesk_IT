import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import { Navbar } from './components/Navbar';
import { MoodMatcher } from './components/MoodMatcher';
import { ApiKeyModal } from './components/ApiKeyModal';
import { HomePage } from './pages/HomePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const [showMood, setShowMood] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <FavoritesProvider>
      <Router>
        <div className="app-container">
          <Navbar
            onOpenMoodMatcher={() => setShowMood(true)}
            onOpenApiKeyModal={() => setShowKey(true)}
          />

          <main className="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    onOpenMoodMatcher={() => setShowMood(true)}
                    externalQuery={query}
                  />
                }
              />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <MoodMatcher
            isOpen={showMood}
            onClose={() => setShowMood(false)}
            onApplyMoodQuery={(val) => setQuery(val)}
          />

          <ApiKeyModal
            isOpen={showKey}
            onClose={() => setShowKey(false)}
          />
        </div>
      </Router>
    </FavoritesProvider>
  );
}
