'use client';

import React from 'react';
import { useAppSelector } from '../redux/hooks';
import { selectFavoritesCount } from '../redux/slices/favoritesSlice';
import { selectFilter } from '../redux/slices/filterSlice';
import { selectThemeMode } from '../redux/slices/themeSlice';
import { X, Activity, Layers, CheckCircle2, Sliders, Sun, Moon, Database } from 'lucide-react';

export function ReduxDevToolsGuideModal({ isOpen, onClose }) {
  const favoritesCount = useAppSelector(selectFavoritesCount);
  const filter = useAppSelector(selectFilter);
  const themeMode = useAppSelector(selectThemeMode);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content animate-slide-up"
        style={{ maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: '#764ABC', padding: '8px', borderRadius: '8px', display: 'flex' }}>
              <Layers size={20} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                Sprint 10: Redux DevTools Verification Guide
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                QA Demo Protocol: Verifying Global State Mutation & LocalStorage Persistence
              </p>
            </div>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          {/* Live Global State Snapshot */}
          <div style={{ background: 'rgba(118, 74, 188, 0.1)', border: '1px solid rgba(118, 74, 188, 0.3)', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', color: '#B39DDB', fontWeight: 700, fontSize: '0.9rem' }}>
              <Activity size={16} /> Live Redux Global State Snapshot:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>state.favorites:</span>
                <div style={{ fontWeight: 800, color: '#E50914' }}>{favoritesCount} saved item(s)</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>state.theme:</span>
                <div style={{ fontWeight: 800, textTransform: 'capitalize', color: '#4CAF50' }}>{themeMode} mode</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>state.filter.minRating:</span>
                <div style={{ fontWeight: 800, color: '#FFD700' }}>{filter.minRating} stars</div>
              </div>
            </div>
          </div>

          {/* QA Verification Steps */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.6rem' }}>
              How to demonstrate for Sprint 10 QA (3 Min Max):
            </h4>
            <ol style={{ paddingLeft: '1.25rem', lineHeight: '1.6', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li>
                Open <strong>Chrome / Edge DevTools</strong> (F12 or Right Click &rarr; Inspect).
              </li>
              <li>
                Click on the <strong>Redux</strong> tab in DevTools top navigation bar.
              </li>
              <li>
                Click the <strong>Heart Icon</strong> on any movie card. Observe standard dispatch action <code>favorites/toggleFavorite</code> executed in DevTools inspector tree.
              </li>
              <li>
                Slide the <strong>Minimum Rating Slider</strong> or select a <strong>Genre</strong> in the sidebar. Observe action <code>filter/setMinRating</code> and instant grid sync.
              </li>
              <li>
                Toggle <strong>Dark / Light mode</strong> in Navbar. Observe action <code>theme/toggleTheme</code> and instant DOM CSS variable update.
              </li>
              <li>
                Hit <strong>Browser Refresh (F5)</strong>. Verify that state persists from <code>localStorage</code> (satisfying Technical FAQ 4).
              </li>
            </ol>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Got It, Continue Testing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReduxDevToolsGuideModal;
