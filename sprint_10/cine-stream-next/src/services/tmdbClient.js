import { TMDB_BASE_URL, FALLBACK_MOVIES } from '../utils/constants';

function getClientApiKey() {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('cine_tmdb_key');
    if (local && local.trim()) return local.trim();
  }
  return process.env.NEXT_PUBLIC_TMDB_KEY || '';
}

/**
 * Fetch Popular Movies on Client
 */
export async function fetchPopularMoviesClient(page = 1) {
  const key = getClientApiKey();

  if (key) {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${key}&language=en-US&page=${page}`
      );
      if (res.ok) {
        const data = await res.json();
        return {
          results: data.results || [],
          totalPages: data.total_pages || 1,
          page: data.page || 1,
          isFallback: false
        };
      }
    } catch (err) {
      console.warn('Client TMDB fetch error:', err);
    }
  }

  const totalPages = 5;
  const mock = FALLBACK_MOVIES.map(item => ({
    ...item,
    id: item.id + (page - 1) * 100,
    title: page > 1 ? `${item.title} (Vol ${page})` : item.title
  }));

  return {
    results: mock,
    totalPages,
    page,
    isFallback: true
  };
}

/**
 * Search Movies on Client (debounced query)
 */
export async function searchMoviesClient(query, page = 1) {
  if (!query || !query.trim()) {
    return fetchPopularMoviesClient(page);
  }

  const key = getClientApiKey();

  if (key) {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${key}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
      );
      if (res.ok) {
        const data = await res.json();
        return {
          results: data.results || [],
          totalPages: data.total_pages || 1,
          page: data.page || 1,
          isFallback: false
        };
      }
    } catch (err) {
      console.warn('Client TMDB search error:', err);
    }
  }

  const q = query.toLowerCase();
  const list = FALLBACK_MOVIES.filter(m =>
    m.title.toLowerCase().includes(q) ||
    m.overview.toLowerCase().includes(q)
  );

  return {
    results: list,
    totalPages: 1,
    page: 1,
    isFallback: true
  };
}
