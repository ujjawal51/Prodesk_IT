'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Next.js Client Runtime Error:', error);
  }, [error]);

  return (
    <div className="empty-state-box animate-fade-in" style={{ padding: '6rem 2rem' }}>
      <div style={{ background: 'rgba(229, 9, 20, 0.15)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
        <AlertTriangle size={54} color="#E50914" />
      </div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
        Playback Anomaly Encountered
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.6 }}>
        {error?.message || 'An unexpected rendering failure occurred while serving this cinematic asset.'}
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button type="button" className="btn btn-primary" onClick={() => reset()}>
          <RefreshCw size={18} /> Retry Stream
        </button>
        <Link href="/" className="btn btn-secondary">
          <Home size={18} /> Return Home
        </Link>
      </div>
    </div>
  );
}
