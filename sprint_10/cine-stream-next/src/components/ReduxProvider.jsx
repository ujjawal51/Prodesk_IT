'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { hydrateFavorites } from '../redux/slices/favoritesSlice';
import { setTheme } from '../redux/slices/themeSlice';

/**
 * Sprint 10 Track A: Global Redux Provider Wrapper
 * Handles store distribution and client-side localStorage hydration.
 */
function ReduxStateHydrator({ children }) {
  useEffect(() => {
    // Hydrate favorites from localStorage
    try {
      const storedFavorites = localStorage.getItem('cine_stream_redux_favorites_v10');
      if (storedFavorites) {
        const parsed = JSON.parse(storedFavorites);
        if (Array.isArray(parsed)) {
          store.dispatch(hydrateFavorites(parsed));
        }
      } else {
        // Also check v2 legacy context key to preserve past favorites seamlessly
        const legacyStored = localStorage.getItem('cine_stream_favorites_v2');
        if (legacyStored) {
          const parsed = JSON.parse(legacyStored);
          if (Array.isArray(parsed)) {
            store.dispatch(hydrateFavorites(parsed));
          }
        } else {
          store.dispatch(hydrateFavorites([]));
        }
      }
    } catch (e) {
      console.warn('Favorites hydration warning:', e);
      store.dispatch(hydrateFavorites([]));
    }

    // Hydrate theme from localStorage
    try {
      const storedTheme = localStorage.getItem('cine_stream_redux_theme_v10');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        store.dispatch(setTheme(storedTheme));
      }
    } catch (e) {
      console.warn('Theme hydration warning:', e);
    }
  }, []);

  return children;
}

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <ReduxStateHydrator>{children}</ReduxStateHydrator>
    </Provider>
  );
}

export default ReduxProvider;
