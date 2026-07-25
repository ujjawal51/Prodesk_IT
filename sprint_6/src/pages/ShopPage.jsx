import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'

const API_URL = 'https://dummyjson.com/products?limit=100'

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (!cancelled) {
          setProducts(data.products)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [])

  const categories = ['all', ...new Set(products.map(p => p.category))]

  const filtered = products.filter(p => {
    const matchesQuery =
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    const matchesCategory =
      activeCategory === 'all' || p.category === activeCategory
    return matchesQuery && matchesCategory
  })

  return (
    <div className="page-wrapper">
      <div className="shop-page">
        <div className="container">

          <div className="shop-page__header">
            <div>
              <h1 className="shop-page__title">Shop All Products</h1>
              <p className="shop-page__count" aria-live="polite">
                {loading ? 'Loading…' : `${filtered.length} products`}
              </p>
            </div>

            <div className="shop-search__input-wrap">
              <span className="shop-search__icon" aria-hidden="true">🔍</span>
              <input
                id="shop-search-input"
                type="search"
                className="shop-search__input"
                placeholder="Search products or categories…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-label="Search products"
              />
            </div>
          </div>

          {!loading && (
            <div
              className="category-filters"
              role="group"
              aria-label="Filter by category"
            >
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-chip ${activeCategory === cat ? 'category-chip--active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  id={`category-chip-${cat}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="spinner-wrap" role="status" aria-label="Loading products">
              <div className="spinner" aria-hidden="true" />
              <p>Fetching products from API…</p>
            </div>
          )}

          {error && (
            <div
              role="alert"
              style={{
                background: 'var(--error-bg)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                textAlign: 'center',
                color: 'var(--error)',
              }}
            >
              <p style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>
                Failed to load products
              </p>
              <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div
              role="status"
              style={{
                textAlign: 'center',
                padding: '64px 32px',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }} aria-hidden="true">
                🔍
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>
                No products found
              </h2>
              <p style={{ fontSize: '0.875rem' }}>
                Try a different search term or category.
              </p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <ul
              className="product-grid"
              role="list"
              aria-label={`${filtered.length} products`}
            >
              {filtered.map(product => (
                <li key={product.id} style={{ listStyle: 'none' }}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          )}

        </div>
      </div>
    </div>
  )
}
