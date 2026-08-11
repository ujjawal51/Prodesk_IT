import React from 'react';

export function SkeletonCard() {
  return (
    <div className="movie-card skeleton-card" style={{ opacity: 0.7 }}>
      <div className="poster-wrapper skeleton" />
      <div className="movie-info" style={{ gap: '0.5rem' }}>
        <div className="skeleton" style={{ height: '1.2rem', width: '80%' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="skeleton" style={{ height: '0.9rem', width: '30%' }} />
          <div className="skeleton" style={{ height: '0.9rem', width: '25%' }} />
        </div>
      </div>
    </div>
  );
}
