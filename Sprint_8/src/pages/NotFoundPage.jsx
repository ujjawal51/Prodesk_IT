import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '8rem 1rem 4rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Film size={64} color="#E50914" style={{ marginBottom: '1.5rem' }} />
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}>
        404 - Page Not Found
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '450px' }}>
        Lost in the cinematic cosmos? The movie title or page you requested doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
