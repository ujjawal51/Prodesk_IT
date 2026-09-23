import { TMDB_BASE_URL, FALLBACK_MOVIES } from '../utils/constants';

/**
 * Server-Side TMDB Data Fetcher for Next.js 15 Server Components (SSR)
 * Executes on Node server runtime during request/build time without useEffect
 */

function getServerApiKey() {
  return process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_KEY || '';
}

/**
 * Fetch Popular Movies on Server (SSR)
 */
export async function fetchPopularMoviesServer(page = 1) {
  const key = getServerApiKey();

  if (key) {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${key}&language=en-US&page=${page}`,
        { next: { revalidate: 3600 } } // Cache for 1 hour
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
      console.warn('Server TMDB Popular Movies fetch error:', err.message);
    }
  }

  // High-fidelity fallback dataset for zero-configuration execution
  const mock = FALLBACK_MOVIES.map(item => ({
    ...item,
    id: item.id + (page - 1) * 100,
    title: page > 1 ? `${item.title} (Vol ${page})` : item.title
  }));

  return {
    results: mock,
    totalPages: 5,
    page,
    isFallback: true
  };
}

/**
 * Fetch Single Movie Details on Server (SSR) for /movie/[id] and generateMetadata
 */
export async function fetchMovieDetailsServer(id) {
  const key = getServerApiKey();

  if (key) {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/movie/${id}?api_key=${key}&language=en-US&append_to_response=credits,videos,similar`,
        { next: { revalidate: 3600 } }
      );

      if (res.ok) {
        const data = await res.json();
        return {
          ...data,
          isFallback: false
        };
      }
    } catch (err) {
      console.warn(`Server TMDB fetch error for movie ${id}:`, err.message);
    }
  }

  // Match in fallback dataset or return default synthetic movie
  const found = FALLBACK_MOVIES.find(m => String(m.id) === String(id));
  if (found) {
    return {
      ...found,
      isFallback: true
    };
  }

  // Generative fallback for unknown ID
  return {
    id: Number(id) || 101,
    title: `Cinematic Feature #${id}`,
    tagline: 'An epic cinematic journey beyond imagination.',
    overview: 'An ambitious cinematic marvel exploring destiny, courage, and the bounds of time. Directed with breathtaking visual artistry and sound design.',
    release_date: '2024-06-15',
    vote_average: 8.5,
    vote_count: 1240,
    runtime: 142,
    genres: [{ id: 878, name: 'Sci-Fi' }, { id: 28, name: 'Action' }],
    poster_path: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80',
    backdrop_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
    isFallback: true
  };
}
