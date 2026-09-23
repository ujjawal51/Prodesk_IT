import { createSlice } from '@reduxjs/toolkit';

/**
 * Sprint 10 Track A: Phase 2 - Complex Multifaceted Filter Redux Slice
 * Maps active sidebar filter parameters to the global Redux store.
 */
const initialState = {
  searchQuery: '',
  category: 'all',        // Genre / Category
  minRating: 0,           // Rating Range (0.0 to 10.0)
  sortBy: 'popularity.desc', // popularity.desc | vote_average.desc | release_date.desc | title.asc
  releaseYear: 'all',     // all | 2024 | 2023 | 2022 | 2021 | 2020 | classic
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    // 1. Update text search query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload ?? '';
    },

    // 2. Update category / genre filter
    setCategory: (state, action) => {
      state.category = action.payload ?? 'all';
    },

    // 3. Update minimum rating slider (0.0 to 10.0)
    setMinRating: (state, action) => {
      state.minRating = Number(action.payload) || 0;
    },

    // 4. Update sorting criteria
    setSortBy: (state, action) => {
      state.sortBy = action.payload || 'popularity.desc';
    },

    // 5. Update release year filter
    setReleaseYear: (state, action) => {
      state.releaseYear = action.payload || 'all';
    },

    // 6. Reset all filter parameters to pristine state
    resetFilters: (state) => {
      state.searchQuery = '';
      state.category = 'all';
      state.minRating = 0;
      state.sortBy = 'popularity.desc';
      state.releaseYear = 'all';
    },
  },
});

// Action creators
export const {
  setSearchQuery,
  setCategory,
  setMinRating,
  setSortBy,
  setReleaseYear,
  resetFilters,
} = filterSlice.actions;

// Selectors
export const selectFilter = (state) => state.filter;
export const selectSearchQuery = (state) => state.filter.searchQuery;
export const selectCategory = (state) => state.filter.category;
export const selectMinRating = (state) => state.filter.minRating;
export const selectSortBy = (state) => state.filter.sortBy;
export const selectReleaseYear = (state) => state.filter.releaseYear;

// Count how many non-default filters are actively applied
export const selectActiveFiltersCount = (state) => {
  let count = 0;
  if (state.filter.searchQuery.trim()) count++;
  if (state.filter.category !== 'all') count++;
  if (state.filter.minRating > 0) count++;
  if (state.filter.sortBy !== 'popularity.desc') count++;
  if (state.filter.releaseYear !== 'all') count++;
  return count;
};

export default filterSlice.reducer;
