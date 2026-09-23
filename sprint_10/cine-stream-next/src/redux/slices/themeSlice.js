import { createSlice } from '@reduxjs/toolkit';

/**
 * Sprint 10 Track A: Phase 3 - Global Theme Manager Redux Slice
 * Manages Dark/Light mode theme state entirely through the global Redux store.
 */
const initialState = {
  mode: 'dark', // 'dark' | 'light'
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // 1. Toggle between Dark and Light mode
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
    },

    // 2. Explicitly set theme
    setTheme: (state, action) => {
      if (action.payload === 'dark' || action.payload === 'light') {
        state.mode = action.payload;
      }
    },
  },
});

// Action creators
export const { toggleTheme, setTheme } = themeSlice.actions;

// Selectors
export const selectThemeMode = (state) => state.theme.mode;
export const selectIsDarkMode = (state) => state.theme.mode === 'dark';

export default themeSlice.reducer;
