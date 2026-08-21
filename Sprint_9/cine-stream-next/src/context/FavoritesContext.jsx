'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';

export const FavoritesContext = createContext();

const STORAGE_KEY = 'cine_stream_favorites_v2';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (err) {
      console.warn('Failed to load favorites from localStorage', err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (err) {
        console.warn('Failed to save favorites to localStorage', err);
      }
    }
  }, [favorites, isHydrated]);

  const addFavorite = useCallback((movie) => {
    setFavorites((prev) => {
      if (prev.some((m) => String(m.id) === String(movie.id))) return prev;
      return [movie, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((movieId) => {
    setFavorites((prev) => prev.filter((m) => String(m.id) !== String(movieId)));
  }, []);

  const isFavorite = useCallback(
    (movieId) => favorites.some((m) => String(m.id) === String(movieId)),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (movie) => {
      if (isFavorite(movie.id)) {
        removeFavorite(movie.id);
      } else {
        addFavorite(movie);
      }
    },
    [isFavorite, removeFavorite, addFavorite]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesCount: favorites.length,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        isHydrated
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
