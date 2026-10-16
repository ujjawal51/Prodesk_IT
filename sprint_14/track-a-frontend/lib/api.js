import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── Axios Instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
// Inject JWT into every request header automatically
// This satisfies the requirement: "inject token via headers using Bearer schema"
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (set by Zustand persist middleware)
    const authStorage = localStorage.getItem('sprint14-auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (err) {
        console.error('Error parsing auth storage:', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ──────────────────────────────────────────────────────
// Phase 3 Client Interception: If JWT is null or expired, force redirect to /login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // 401 = Unauthorized (expired or invalid token)
    if (status === 401 && typeof window !== 'undefined') {
      // Clear auth storage
      localStorage.removeItem('sprint14-auth-storage');
      // Force redirect to login
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// ─── Auth API Functions ────────────────────────────────────────────────────────

export const authAPI = {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Login with email and password
   * POST /api/auth/login
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Get current logged-in user
   * GET /api/auth/me
   */
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Logout
   * POST /api/auth/logout
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

export default api;
