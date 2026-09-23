import { TMDB_IMAGE_BASE_URL, TMDB_BACKDROP_BASE_URL, GENRES } from './constants';

export function getPosterUrl(path, fallback = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80') {
  if (!path) return fallback;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${TMDB_IMAGE_BASE_URL}${path}`;
}

export function getBackdropUrl(path, fallback = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80') {
  if (!path) return fallback;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${TMDB_BACKDROP_BASE_URL}${path}`;
}

export function getYear(dateStr) {
  if (!dateStr) return 'N/A';
  const yr = String(dateStr).substring(0, 4);
  return isNaN(Number(yr)) ? 'N/A' : yr;
}

export function formatRating(val) {
  if (val === undefined || val === null || isNaN(Number(val))) return 'N/A';
  return Number(val).toFixed(1);
}

export function formatRuntime(mins) {
  if (!mins || isNaN(Number(mins))) return '2h 15m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

export function getGenres(ids = []) {
  if (!ids || !ids.length) return ['General'];
  const list = ids
    .map(id => GENRES.find(g => g.id === id)?.name)
    .filter(Boolean);
  return list.length > 0 ? list : ['General'];
}
