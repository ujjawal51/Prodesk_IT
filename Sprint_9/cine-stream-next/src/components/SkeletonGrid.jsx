import React from 'react';

export function SkeletonGrid({ count = 8 }) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="movie-grid">
      {items.map((i) => (
        <div key={i} className="movie-card" style={{ pointerEvents: 'none' }}>
          <div className="poster-wrapper skeleton" style={{ position: 'relative' }} />
          <div className="movie-info" style={{ gap: '0.6rem' }}>
            <div className="skeleton" style={{ height: '18px', width: '80%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="skeleton" style={{ height: '14px', width: '30%' }} />
              <div className="skeleton" style={{ height: '14px', width: '25%' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
