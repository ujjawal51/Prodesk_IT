import React from 'react';

/**
 * Phase 2: Dynamic "Loading..." UI Skeleton
 * Renders animated shimmer cards during asynchronous network delays
 */
export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '24px',
      width: '100%'
    }}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '380px'
          }}
        >
          {/* Shimmer Image Box */}
          <div className="skeleton-box" style={{ height: '190px', width: '100%' }} />

          {/* Shimmer Text Content */}
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="skeleton-box" style={{ height: '16px', width: '70px' }} />
              <div className="skeleton-box" style={{ height: '16px', width: '40px' }} />
            </div>

            <div className="skeleton-box" style={{ height: '24px', width: '85%' }} />
            <div className="skeleton-box" style={{ height: '16px', width: '100%' }} />
            <div className="skeleton-box" style={{ height: '16px', width: '60%' }} />

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="skeleton-box" style={{ height: '18px', width: '80px' }} />
              <div className="skeleton-box" style={{ height: '32px', width: '90px' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
