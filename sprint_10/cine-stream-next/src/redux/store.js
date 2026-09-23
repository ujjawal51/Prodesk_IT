import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './slices/favoritesSlice';
import filterReducer from './slices/filterSlice';
import themeReducer from './slices/themeSlice';

/**
 * LocalStorage Persistence Middleware
 * Syncs favorites and theme slices to localStorage whenever their state changes.
 */
const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (typeof window !== 'undefined') {
    try {
      const state = store.getState();
      
      // Persist favorites
      if (action.type.startsWith('favorites/')) {
        localStorage.setItem('cine_stream_redux_favorites_v10', JSON.stringify(state.favorites.items));
      }

      // Persist theme
      if (action.type.startsWith('theme/')) {
        localStorage.setItem('cine_stream_redux_theme_v10', state.theme.mode);
      }
    } catch (err) {
      console.warn('Failed to sync Redux state to localStorage:', err);
    }
  }

  return result;
};

/**
 * Sprint 10 Track A: Phase 1 - Global Store Architecture
 * Configured via Redux Toolkit with DevTools extension enabled.
 */
export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    filter: filterReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(localStorageMiddleware),
  devTools: process.env.NODE_ENV !== 'production' || true, // Explicitly enabled for QA Demo evaluation
});

export default store;
