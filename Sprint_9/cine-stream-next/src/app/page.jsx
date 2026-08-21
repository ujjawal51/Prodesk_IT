import { fetchPopularMoviesServer } from '../services/tmdbServer';
import { HeroBanner } from '../components/HeroBanner';
import { MovieExplorerClient } from '../components/MovieExplorerClient';

/**
 * Server Component (App Router Root Page)
 * Phase 2 Requirement: Executes initial TMDB popular movies fetch directly on the server.
 * Zero useEffect needed for initial data hydration!
 */
export default async function HomePage() {
  // Direct Server-Side Data Fetch
  const popularData = await fetchPopularMoviesServer(1);
  const featuredMovie = popularData.results?.[0] || null;

  return (
    <div>
      {featuredMovie && (
        <HeroBanner movie={featuredMovie} />
      )}

      <MovieExplorerClient
        initialMovies={popularData.results || []}
        initialPage={popularData.page || 1}
        totalPages={popularData.totalPages || 5}
      />
    </div>
  );
}
