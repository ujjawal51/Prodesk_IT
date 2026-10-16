'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../store/authStore';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, clearAuth } = useAuthStore();

  // ─── Phase 3: Client-Side Route Guard ─────────────────────────────────────
  // If JWT is null or user not authenticated → redirect to /login
  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.replace('/login');
    }
  }, [isAuthenticated, token, router]);

  // ─── Logout Handler ─────────────────────────────────────────────────────────
  const handleLogout = () => {
    // Clear Zustand store → removes token from localStorage
    clearAuth();
    router.replace('/login');
  };

  // ─── Copy Token to Clipboard ────────────────────────────────────────────────
  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      alert('JWT token copied to clipboard! ✅');
    }
  };

  // Don't render if not authenticated (prevents flash)
  if (!isAuthenticated || !user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0f1e',
          color: '#9ca3af',
          fontSize: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="spinner" style={{ borderTopColor: '#6366f1', width: '24px', height: '24px', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1' }} />
          Verifying authentication...
        </div>
      </div>
    );
  }

  // Get user initials for avatar
  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="dashboard-layout">
      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="navbar-brand">
          <div className="navbar-brand-icon">🔐</div>
          <span>ProDesk IT</span>
        </div>
        <div className="navbar-user">
          <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            Hello, <strong style={{ color: '#f9fafb' }}>{user.name}</strong>
          </span>
          <div className="user-avatar" title={user.email}>
            {initials}
          </div>
          <button
            id="logout-btn"
            className="btn-logout"
            onClick={handleLogout}
            aria-label="Logout"
          >
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className="dashboard-content" role="main">
        {/* Welcome Header */}
        <div className="dashboard-welcome">
          <span className="protected-badge">🛡️ Protected Route — JWT Verified</span>
          <h1>Welcome back, {user.name.split(' ')[0]}! 👋</h1>
          <p>Your Sprint 14 Authentication Dashboard — Walking Skeleton is live.</p>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-grid">
          <div className="stats-card">
            <div className="stats-card-icon purple">🔑</div>
            <div className="stats-card-info">
              <h3>Active</h3>
              <p>Auth Status</p>
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-card-icon green">🛡️</div>
            <div className="stats-card-info">
              <h3>JWT</h3>
              <p>Token Type</p>
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-card-icon yellow">⚡</div>
            <div className="stats-card-info">
              <h3>7 Days</h3>
              <p>Token Expiry</p>
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-card-icon blue">🗄️</div>
            <div className="stats-card-info">
              <h3>MongoDB</h3>
              <p>Database</p>
            </div>
          </div>
        </div>

        {/* Two-column grid for info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* User Profile Card */}
          <div className="info-card">
            <h3>👤 User Profile</h3>
            <div className="info-row">
              <span className="info-row-label">Name</span>
              <span className="info-row-value">{user.name}</span>
            </div>
            <div className="info-row">
              <span className="info-row-label">Email</span>
              <span className="info-row-value">{user.email}</span>
            </div>
            <div className="info-row">
              <span className="info-row-label">Role</span>
              <span className="info-row-value" style={{ textTransform: 'capitalize' }}>
                {user.role || 'user'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-row-label">User ID</span>
              <span className="info-row-value" style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#6b7280' }}>
                {user._id?.slice(0, 16)}...
              </span>
            </div>
            <div className="info-row">
              <span className="info-row-label">Status</span>
              <span className="tag-active">● Active</span>
            </div>
          </div>

          {/* Tech Stack Card */}
          <div className="info-card">
            <h3>⚙️ Sprint 14 Tech Stack</h3>
            <div className="info-row">
              <span className="info-row-label">Frontend</span>
              <span className="info-row-value">Next.js 14 (App Router)</span>
            </div>
            <div className="info-row">
              <span className="info-row-label">State</span>
              <span className="info-row-value">Zustand + localStorage</span>
            </div>
            <div className="info-row">
              <span className="info-row-label">Backend</span>
              <span className="info-row-value">Node.js + Express</span>
            </div>
            <div className="info-row">
              <span className="info-row-label">Database</span>
              <span className="info-row-value">MongoDB + Mongoose</span>
            </div>
            <div className="info-row">
              <span className="info-row-label">Auth</span>
              <span className="info-row-value">JWT + bcryptjs</span>
            </div>
          </div>
        </div>

        {/* JWT Token Display */}
        <div className="info-card" style={{ marginTop: '1.5rem' }}>
          <h3>🔑 Your JWT Token (click to copy)</h3>
          <div
            className="token-display"
            onClick={copyToken}
            title="Click to copy JWT token"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && copyToken()}
          >
            {token}
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.5rem' }}>
            ⚠️ This token is stored in localStorage. In production, use httpOnly cookies.
          </p>
        </div>

        {/* Phase Info */}
        <div className="info-card" style={{ marginTop: '1.5rem', background: 'rgba(99,102,241,0.05)', borderColor: 'rgba(99,102,241,0.2)' }}>
          <h3>📋 Sprint 14 Phases Completed</h3>
          {[
            { phase: 'P0 (Mandatory)', label: 'Phase 1 — Backend Security & Schema', status: '✅' },
            { phase: 'P0 (Mandatory)', label: 'Phase 1 — Base Routing & Form Scaffolding', status: '✅' },
            { phase: 'P1 (Priority)', label: 'Phase 2 — JWT Generation & Client Sync', status: '✅' },
            { phase: 'P1 (Priority)', label: 'Phase 2 — BaaS Integration (Custom JWT)', status: '✅' },
            { phase: 'P2 (Advanced)', label: 'Phase 3 — Express JWT Middleware', status: '✅' },
            { phase: 'P2 (Advanced)', label: 'Phase 3 — Next.js Route Guards + Zustand', status: '✅' },
          ].map((item, i) => (
            <div className="info-row" key={i}>
              <span className="info-row-label">
                <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>[{item.phase}]</span>{' '}
                {item.label}
              </span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>{item.status} Done</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
