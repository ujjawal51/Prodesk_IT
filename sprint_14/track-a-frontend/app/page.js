import Link from 'next/link';

export const metadata = {
  title: 'Sprint 14 - Secure Auth System | ProDesk IT',
  description: 'Walking Skeleton - JWT Authentication MVP. Register, login, and access your secure dashboard.',
};

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        background: 'linear-gradient(135deg, #0a0f1e 0%, #111827 50%, #0a0f1e 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow effects */}
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Logo icon */}
      <div
        style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 20px 40px rgba(99,102,241,0.4)',
          position: 'relative',
        }}
      >
        🔐
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <p
          style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#818cf8',
            padding: '0.4rem 1rem',
            borderRadius: '100px',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'inline-block',
            marginBottom: '1.5rem',
            letterSpacing: '0.05em',
          }}
        >
          🚀 SPRINT 14 — WALKING SKELETON
        </p>

        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
            lineHeight: 1.2,
          }}
        >
          Secure Auth System
        </h1>

        <p
          style={{
            color: '#9ca3af',
            fontSize: '1.1rem',
            maxWidth: '500px',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}
        >
          End-to-end JWT Authentication with protected routes,
          bcrypt password hashing, and global state management.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" className="btn btn-primary" style={{ width: 'auto', padding: '0.875rem 2rem' }}>
            🚀 Get Started — Register
          </Link>
          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 2rem',
              border: '1px solid rgba(99,102,241,0.4)',
              borderRadius: '8px',
              color: '#818cf8',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 250ms ease',
              background: 'rgba(99,102,241,0.05)',
            }}
          >
            🔑 Login
          </Link>
        </div>

        {/* Feature badges */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '3rem' }}>
          {['JWT Auth', 'bcryptjs Hashing', 'Protected Routes', 'Zustand State', 'MongoDB'].map((feat) => (
            <span
              key={feat}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '0.4rem 0.9rem',
                borderRadius: '100px',
                fontSize: '0.8rem',
                color: '#9ca3af',
              }}
            >
              {feat}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
