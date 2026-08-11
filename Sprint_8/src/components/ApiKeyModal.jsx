import React, { useState } from 'react';
import { X, Key, Check, Info } from 'lucide-react';

export function ApiKeyModal({ isOpen, onClose }) {
  const [tmdbKey, setTmdbKey] = useState(() => localStorage.getItem('cine_tmdb_key') || '');
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('cine_gemini_key') || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const onSave = (e) => {
    e.preventDefault();
    localStorage.setItem('cine_tmdb_key', tmdbKey.trim());
    localStorage.setItem('cine_gemini_key', geminiKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
      window.location.reload();
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '520px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Key size={24} color="#E50914" />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800 }}>
            API Key Configuration
          </h3>
        </div>

        <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '0.85rem 1rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            API keys are optional. Cine-Stream includes a high-fidelity built-in dataset fallback if no key is supplied.
          </span>
        </div>

        <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              TMDB API Key (v3 API Key)
            </label>
            <input
              type="password"
              className="search-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="Paste your TMDB API key..."
              value={tmdbKey}
              onChange={(e) => setTmdbKey(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Google Gemini API Key (Optional)
            </label>
            <input
              type="password"
              className="search-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="Paste your Gemini API key..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
            />
          </div>

          {saved && (
            <div style={{ color: '#4CAF50', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <Check size={18} /> API keys saved! Reloading application...
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Keys
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
