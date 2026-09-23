import { createSlice } from '@reduxjs/toolkit';

/**
 * Sprint 10 Track A: Phase 1 - Favorites Redux Slice
 * Refactored out of Context API into a dedicated RTK Slice.
 * Proves state mutation via standard dispatch actions.
 */
const initialState = {
  items: [],
  isHydrated: false,
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // 1. Add movie to favorites
    addFavorite: (state, action) => {
      const movie = action.payload;
      if (!movie || !movie.id) return;
      const exists = state.items.some((m) => String(m.id) === String(movie.id));
      if (!exists) {
        state.items.unshift(movie);
      }
    },

    // 2. Remove movie from favorites
    removeFavorite: (state, action) => {
      const movieId = action.payload;
      state.items = state.items.filter((m) => String(m.id) !== String(movieId));
    },

    // 3. Toggle favorite state
    toggleFavorite: (state, action) => {
      const movie = action.payload;
      if (!movie || !movie.id) return;
      const index = state.items.findIndex((m) => String(m.id) === String(movie.id));
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.unshift(movie);
      }
    },

    // 4. Clear all saved favorites
    clearFavorites: (state) => {
      state.items = [];
    },

    // 5. Hydrate favorites from localStorage (FAQ 4: state survives hard reload)
    hydrateFavorites: (state, action) => {
      state.items = action.payload || [];
      state.isHydrated = true;
    },
  },
});

// Action creators
export const {
  addFavorite,
  removeFavorite,
  toggleFavorite,
  clearFavorites,
  hydrateFavorites,
} = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state) => state.favorites.items;
export const selectFavoritesCount = (state) => state.favorites.items.length;
export const selectIsFavorite = (state, movieId) =>
  state.favorites.items.some((m) => String(m.id) === String(movieId));
export const selectIsFavoritesHydrated = (state) => state.favorites.isHydrated;

export default favoritesSlice.reducer;
