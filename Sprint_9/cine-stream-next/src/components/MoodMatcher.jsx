'use client';

import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2 } from 'lucide-react';
import { matchMoodToMovie } from '../services/geminiAi';

export function MoodMatcher({ isOpen, onClose, onApplyMoodQuery }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  if (!isOpen) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResult('');

    try {
      const q = await matchMoodToMovie(prompt);
      setResult(q);
      if (q) {
        onApplyMoodQuery(q);
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-fade-in"
        style={{ maxWidth: '550px', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: 'rgba(255, 215, 0, 0.15)', padding: '10px', borderRadius: '12px' }}>
            <Sparkles size={24} color="#FFD700" />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800 }}>
              AI Mood Matcher
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Describe your mood or vibe & Gemini AI will match the perfect film.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ marginTop: '1.5rem' }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. 'I had an exhausting week and want an uplifting visual space adventure...'"
            rows={4}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              color: 'white',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              resize: 'none',
              outline: 'none',
              marginBottom: '1.25rem'
            }}
          />

          {result && (
            <div
              style={{
                background: 'rgba(229, 9, 20, 0.15)',
                border: '1px solid var(--accent-red)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                color: 'white',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}
            >
              ✨ AI Recommendation: <strong>&ldquo;{result}&rdquo;</strong>! Filtering catalogue...
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || !prompt.trim()}>
              {loading ? <Loader2 size={18} className="spinner" /> : <Send size={18} />}
              {loading ? 'Analyzing Mood...' : 'Discover Film'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
