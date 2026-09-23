'use client';

import React from 'react';
import { Film, Github, Sparkles, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-branding">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Film size={20} color="#E50914" />
            <span style={{ fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>
              CINE-STREAM NEXT
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '360px', lineHeight: 1.5 }}>
            Enterprise-grade Next.js 15 Server-Side Rendered (SSR) cinematic media explorer with TMDB data integration and Gemini AI Mood heuristics.
          </p>
        </div>

        <div className="footer-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={16} color="#4CAF50" />
            <span>Sprint 09 Track A: Next.js 15 Migration</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Powered by Next.js 15 App Router & Server Components
          </p>
        </div>
      </div>
    </footer>
  );
}
