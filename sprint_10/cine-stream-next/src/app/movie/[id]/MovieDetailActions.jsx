'use client';

import React, { useState } from 'react';
import { Heart, Play, Share2, Check } from 'lucide-react';
import { useFavorites } from '../../../hooks/useFavorites';

export function MovieDetailActions({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(movie.id);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="hero-actions" style={{ marginTop: '1rem' }}>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => alert(`Streaming '${movie.title}' in 4K Ultra HD on Cine-Stream!`)}
      >
        <Play size={18} fill="white" /> Watch Stream
      </button>

      <button
        type="button"
        className={`btn ${active ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => toggleFavorite(movie)}
        style={{
          background: active ? '#E50914' : 'rgba(255, 255, 255, 0.1)',
          borderColor: active ? '#E50914' : 'var(--glass-border)'
        }}
      >
        <Heart size={18} fill={active ? 'white' : 'transparent'} color="white" />
        {active ? 'Saved in Favorites' : 'Add to Favorites'}
      </button>

      <button
        type="button"
        className="btn btn-secondary"
        onClick={handleShare}
        title="Share movie link"
      >
        {copied ? <Check size={18} color="#4CAF50" /> : <Share2 size={18} />}
        {copied ? 'Link Copied!' : 'Share'}
      </button>
    </div>
  );
}
