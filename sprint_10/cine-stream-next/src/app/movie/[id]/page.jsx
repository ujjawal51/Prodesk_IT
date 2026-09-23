import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Star, Calendar, Clock, Film, Sparkles, Heart } from 'lucide-react';
import { fetchMovieDetailsServer } from '../../../services/tmdbServer';
import { getPosterUrl, getBackdropUrl, getYear, formatRating, formatRuntime } from '../../../utils/helpers';
import { MovieDetailActions } from './MovieDetailActions';

/**
 * Phase 3 Requirement: SEO Optimization with dynamic metadata injection
 * Next.js executes generateMetadata on the server to dynamically inject <title> and <meta name="description">
 */
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const movie = await fetchMovieDetailsServer(id);

  if (!movie) {
    return {
      title: 'Movie Not Found | Cine-Stream',
      description: 'The requested title could not be found on Cine-Stream.'
    };
  }

  const year = getYear(movie.release_date);
  const title = `${movie.title} (${year}) | Cine-Stream`;
  const description = movie.overview ? movie.overview.substring(0, 160) : 'Watch detailed overview on Cine-Stream.';
  const poster = getPosterUrl(movie.poster_path);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: poster,
          width: 600,
          height: 900,
          alt: movie.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [poster]
    }
  };
}

/**
 * Dynamic Server Route: /movie/[id]
 */
export default async function MovieDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const movie = await fetchMovieDetailsServer(id);

  if (!movie) {
    notFound();
  }

  const poster = getPosterUrl(movie.poster_path);
  const backdrop = getBackdropUrl(movie.backdrop_path);
  const year = getYear(movie.release_date);
  const rating = formatRating(movie.vote_average);
  const runtime = formatRuntime(movie.runtime);

  const genreList = movie.genres && movie.genres.length > 0
    ? movie.genres.map(g => g.name)
    : ['Cinematic Feature'];

  return (
    <div className="movie-detail-container animate-fade-in">
      {/* Back Navigation */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Catalogue
        </Link>
      </div>

      {/* Hero Backdrop Presentation */}
      <div className="movie-detail-hero">
        <div className="hero-bg-container">
          <Image
            src={backdrop}
            alt={movie.title}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
          />
          <div className="hero-gradient-overlay" />
        </div>

        <div className="hero-content" style={{ maxWidth: '850px' }}>
          <div className="hero-badges">
            <div className="rating-badge" style={{ fontSize: '0.95rem', padding: '4px 10px' }}>
              <Star size={16} fill="#FFC107" color="#FFC107" />
              <span>{rating} / 10</span>
            </div>
            {movie.vote_count && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                ({movie.vote_count.toLocaleString()} votes)
              </span>
            )}
          </div>

          <h1 className="hero-title" style={{ fontSize: '3.2rem', marginBottom: '0.5rem' }}>
            {movie.title}
          </h1>

          {movie.tagline && (
            <p style={{ fontStyle: 'italic', color: '#E50914', fontSize: '1.1rem', marginBottom: '1.25rem', fontWeight: 600 }}>
              &ldquo;{movie.tagline}&rdquo;
            </p>
          )}

          {/* Interactive Actions (Client Component for Favorites & Quick Play) */}
          <MovieDetailActions movie={movie} />
        </div>
      </div>

      {/* Media Details Breakdown Grid */}
      <div className="movie-detail-grid">
        {/* Left: Poster */}
        <div>
          <div className="movie-detail-poster">
            <Image
              src={poster}
              alt={movie.title}
              fill
              sizes="300px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </div>

        {/* Right: Metadata & Synopsis */}
        <div className="movie-detail-info">
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: '0.75rem', fontWeight: 800 }}>
              Storyline & Synopsis
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#cccccc', lineHeight: 1.7 }}>
              {movie.overview || 'No synopsis provided for this title.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                Release Date
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <Calendar size={16} color="#E50914" />
                <span>{movie.release_date || year}</span>
              </div>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                Duration
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <Clock size={16} color="#E50914" />
                <span>{runtime}</span>
              </div>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                Rendering Architecture
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: '#4CAF50' }}>
                <Sparkles size={16} color="#4CAF50" />
                <span>Next.js 15 Server-Side Rendered (SSR)</span>
              </div>
            </div>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.6rem' }}>
              Genres
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {genreList.map((genre) => (
                <span
                  key={genre}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid var(--glass-border)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
