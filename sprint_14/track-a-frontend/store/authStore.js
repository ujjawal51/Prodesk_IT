import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Phase 3: State Sync ───────────────────────────────────────────────────────
// Zustand global store to serialize user payload (Name, Email, UID)
// persists to localStorage automatically via the persist middleware
const useAuthStore = create(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────────────
      user: null,          // { _id, name, email, role, createdAt }
      token: null,         // JWT string stored in localStorage
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // ── Actions ────────────────────────────────────────────────────────────

      // Called after successful login/register
      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        });
      },

      // Called on logout or token expiry
      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Set loading state during API calls
      setLoading: (loading) => set({ isLoading: loading }),

      // Set error message
      setError: (error) => set({ error }),

      // Clear error
      clearError: () => set({ error: null }),

      // Get the current token (for API requests)
      getToken: () => get().token,

      // Check if token exists and user is authenticated
      checkAuth: () => {
        const state = get();
        return state.isAuthenticated && state.token !== null;
      },
    }),
    {
      name: 'sprint14-auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
