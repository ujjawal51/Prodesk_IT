import { Link } from 'react-router-dom'

const HERO_PRODUCTS = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max',
    price: '₹1,00,716',
    rating: '★★★★★',
    img: 'https://cdn.dummyjson.com/products/images/smartphones/iPhone%2015%20Pro%20Max/thumbnail.webp',
    badge: 'Trending',
    featured: true,
  },
  {
    id: 2,
    title: 'MacBook Pro 14"',
    price: '₹1,59,516',
    rating: '★★★★★',
    img: 'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/thumbnail.webp',
    badge: 'Top Pick',
    featured: false,
  },
  {
    id: 3,
    title: 'Samsung Galaxy S23',
    price: '₹75,516',
    rating: '★★★★☆',
    img: 'https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S23/thumbnail.webp',
    badge: '-15% OFF',
    featured: false,
  },
  {
    id: 4,
    title: 'Sony WH-1000XM5',
    price: '₹29,316',
    rating: '★★★★★',
    img: 'https://cdn.dummyjson.com/products/images/mobile-accessories/Apple%20AirPods%20Max%20Silver/thumbnail.webp',
    badge: 'New',
    featured: false,
  },
]

export default function HomePage() {
  return (
    <div className="page-wrapper">
      <section className="hero" aria-label="Hero section">
        <div className="container">
          <div className="hero__inner">

            <div className="hero__content">
              <div className="hero__eyebrow">
                <span aria-hidden="true">✨</span>
                Sprint 06 — React SPA
              </div>

              <h1 className="hero__title">
                Shop Smarter,<br />
                Live Better.
              </h1>

              <p className="hero__subtitle">
                Discover thousands of products across categories — electronics,
                fashion, beauty, and more. All in one seamless single-page
                experience, no page reloads.
              </p>

              <div className="hero__actions">
                <Link to="/shop" className="btn btn--primary btn--lg" id="hero-shop-btn">
                  🛍️ Browse Products
                </Link>
                <Link to="/contact" className="btn btn--secondary btn--lg" id="hero-contact-btn">
                  Contact Us
                </Link>
              </div>

              <div className="hero__stats">
                <div className="hero__stat">
                  <span className="hero__stat-num">100+</span>
                  <span className="hero__stat-label">Products</span>
                </div>
                <div className="hero__stat">
                  <span className="hero__stat-num">20+</span>
                  <span className="hero__stat-label">Categories</span>
                </div>
                <div className="hero__stat">
                  <span className="hero__stat-num">4.5★</span>
                  <span className="hero__stat-label">Avg Rating</span>
                </div>
              </div>
            </div>

            <div className="hero__visual" aria-hidden="true">
              {HERO_PRODUCTS.map((p, i) => (
                <div
                  key={p.id}
                  className={`hero-card ${i === 0 ? 'hero-card--featured' : ''}`}
                  style={{
                    animationDelay: `${i * 0.1 + 0.3}s`,
                    animation: `fadeIn 0.6s ease ${i * 0.1 + 0.3}s both`,
                  }}
                >
                  <img
                    src={p.img}
                    alt={p.title}
                    className="hero-card__img"
                    loading="lazy"
                    onError={e => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="hero-card__title">{p.title}</p>
                    <p className="hero-card__rating">{p.rating}</p>
                    <p className="hero-card__price">{p.price}</p>
                  </div>
                  <span className="hero-card__badge">{p.badge}</span>
                </div>
              ))}

              <Link
                to="/shop"
                id="hero-view-all-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-light)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                View all 100+ products →
              </Link>
            </div>

          </div>
        </div>
      </section>

      <section
        aria-labelledby="features-heading"
        style={{
          background: '#f8f8f8',
          borderTop: '1px solid #e8e8e8',
          padding: '64px 0',
          flex: 1,
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--accent-light)',
              marginBottom: '8px',
            }}>
              Why Choose Us
            </p>
            <h2
              id="features-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.75rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
              }}
            >
              Built Different. Built Better.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
            }}
          >
            {FEATURES.map((feat, i) => (
              <FeatureCard key={feat.title} feat={feat} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

function FeatureCard({ feat, delay }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 24px',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        animation: `fadeIn 0.5s ease ${delay}s both`,
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.borderColor = 'var(--border-default)'
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--border-subtle)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          background: 'var(--accent-subtle)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          marginBottom: '16px',
        }}
        aria-hidden="true"
      >
        {feat.icon}
      </div>
      <h3
        style={{
          fontSize: '1rem',
          fontWeight: '700',
          marginBottom: '8px',
          color: 'var(--text-primary)',
        }}
      >
        {feat.title}
      </h3>
      <p
        style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.65',
        }}
      >
        {feat.desc}
      </p>
    </div>
  )
}

const FEATURES = [
  {
    icon: '⚡',
    title: 'Instant Navigation',
    desc: 'Client-side routing with React Router v6. URL changes dynamically — zero page reloads.',
  },
  {
    icon: '🛒',
    title: 'Persistent Cart',
    desc: 'Cart state synced to localStorage via Context API. Survives hard browser refresh.',
  },
  {
    icon: '🔒',
    title: 'Protected Checkout',
    desc: 'Checkout route is guarded by ProtectedRoute. Unauthorized users auto-redirect to login.',
  },
  {
    icon: '🌐',
    title: 'Live API Data',
    desc: 'Products fetched in real-time from DummyJSON REST API with loading and error states.',
  },
]
