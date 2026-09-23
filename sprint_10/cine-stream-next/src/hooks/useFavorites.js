'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  addFavorite,
  removeFavorite,
  toggleFavorite,
  clearFavorites,
  selectFavorites,
  selectFavoritesCount,
  selectIsFavoritesHydrated,
} from '../redux/slices/favoritesSlice';

/**
 * Sprint 10 Track A - Refactored useFavorites Hook
 * Migrated from Context API to Redux Toolkit.
 * Dispatches standard RTK actions and reads directly from global store.
 */
export function useFavorites() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavorites);
  const favoritesCount = useAppSelector(selectFavoritesCount);
  const isHydrated = useAppSelector(selectIsFavoritesHydrated);

  const handleAddFavorite = useCallback(
    (movie) => {
      dispatch(addFavorite(movie));
    },
    [dispatch]
  );

  const handleRemoveFavorite = useCallback(
    (movieId) => {
      dispatch(removeFavorite(movieId));
    },
    [dispatch]
  );

  const handleToggleFavorite = useCallback(
    (movie) => {
      dispatch(toggleFavorite(movie));
    },
    [dispatch]
  );

  const handleClearFavorites = useCallback(() => {
    dispatch(clearFavorites());
  }, [dispatch]);

  const isFavorite = useCallback(
    (movieId) => {
      return favorites.some((m) => String(m.id) === String(movieId));
    },
    [favorites]
  );

  return {
    favorites,
    favoritesCount,
    isHydrated,
    addFavorite: handleAddFavorite,
    removeFavorite: handleRemoveFavorite,
    toggleFavorite: handleToggleFavorite,
    clearFavorites: handleClearFavorites,
    isFavorite,
  };
}

export default useFavorites;
