import Link from 'next/link';
import { Film, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="empty-state-box animate-fade-in" style={{ padding: '6rem 2rem' }}>
      <div style={{ background: 'rgba(229, 9, 20, 0.15)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
        <Film size={54} color="#E50914" />
      </div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1px' }}>
        404
      </h1>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: '1rem', fontWeight: 700 }}>
        Title Not Found in Catalogue
      </h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '460px', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.6 }}>
        The movie or route you requested does not exist or has been relocated to another dimension.
      </p>
      <Link href="/" className="btn btn-primary">
        <Home size={18} /> Return to Homepage
      </Link>
    </div>
  );
}
