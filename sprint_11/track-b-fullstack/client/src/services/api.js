import axios from 'axios';

/**
 * Phase 1: API Hydration
 * Deprecated dummy API URIs and substituted with local Node.js endpoint.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json'
  }
});

// Check Server Health
export const checkServerHealth = async () => {
  const rootUrl = API_BASE_URL.replace('/api', '');
  const res = await axios.get(rootUrl, { timeout: 3000 });
  return res.data;
};

// Phase 1 Data Fetching: GET /api/posts with optional search & category filter
export const getPosts = async (params = {}) => {
  const res = await apiClient.get('/posts', { params });
  return res.data;
};

// GET /api/posts/:id
export const getPostById = async (id) => {
  const res = await apiClient.get(`/posts/${id}`);
  return res.data;
};

// Phase 2 & 3: POST /api/posts with Multipart FormData
export const createPost = async (formData) => {
  // Dispatches payload using FormData object
  const res = await apiClient.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

// PUT /api/posts/:id with optional multipart FormData or JSON
export const updatePost = async (id, payload) => {
  const isFormData = payload instanceof FormData;
  const res = await apiClient.put(`/posts/${id}`, payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
  });
  return res.data;
};

// Phase 2: DELETE /api/posts/:id
export const deletePost = async (id) => {
  const res = await apiClient.delete(`/posts/${id}`);
  return res.data;
};

// PATCH /api/posts/:id/like
export const likePost = async (id) => {
  const res = await apiClient.patch(`/posts/${id}/like`);
  return res.data;
};

export default apiClient;
