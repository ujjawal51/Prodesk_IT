import { TMDB_BASE_URL, FALLBACK_MOVIES } from '../utils/constants';

export function getApiKey() {
  const key = localStorage.getItem('cine_tmdb_key');
  if (key && key.trim() !== '') return key.trim();
  return import.meta.env.VITE_TMDB_KEY || '';
}

export async function fetchPopularMovies(page = 1) {
  const key = getApiKey();
  
  if (key) {
    try {
      const res = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${key}&language=en-US&page=${page}`);
      if (!res.ok) throw new Error(`TMDB status ${res.status}`);
      const data = await res.json();
      return {
        results: data.results || [],
        totalPages: data.total_pages || 1,
        page: data.page || 1,
        isFallback: false
      };
    } catch (err) {
      console.warn('API error:', err);
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

export async function searchMovies(query, page = 1) {
  if (!query || !query.trim()) {
    return fetchPopularMovies(page);
  }

  const key = getApiKey();

  if (key) {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${key}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
      );
      if (!res.ok) throw new Error(`Search status ${res.status}`);
      const data = await res.json();
      return {
        results: data.results || [],
        totalPages: data.total_pages || 1,
        page: data.page || 1,
        isFallback: false
      };
    } catch (err) {
      console.warn('Search API error:', err);
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
