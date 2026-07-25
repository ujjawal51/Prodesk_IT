import { useWishlist } from '../hooks/useWishlist'
import WishlistForm from './WishlistForm'
import WishlistItem from './WishlistItem'

export default function WishlistManager() {
  const {
    items,
    totalCount,
    loading,
    query,
    setQuery,
    addItem,
    removeItem,
    markFound,
  } = useWishlist()

  const foundCount = items.filter(it => it.found).length

  return (
    <div className="wl-page" id="vinyl-wishlist-page">
      {/* Page Header */}
      <header className="wl-header">
        <div className="wl-header-left">
          <div className="wl-logo-icon" aria-hidden="true">🎶</div>
          <div>
            <h1 className="wl-title">Vinyl Wishlist Manager</h1>
            <p className="wl-subtitle">Indie Record Store — Floor Staff Portal</p>
          </div>
        </div>
        <div className="wl-stats" aria-label="Wishlist statistics">
          <div className="wl-stat">
            <span className="wl-stat-num">{totalCount}</span>
            <span className="wl-stat-label">Total</span>
          </div>
          <div className="wl-stat">
            <span className="wl-stat-num">{foundCount}</span>
            <span className="wl-stat-label">Found</span>
          </div>
          <div className="wl-stat">
            <span className="wl-stat-num">{totalCount - foundCount}</span>
            <span className="wl-stat-label">Pending</span>
          </div>
        </div>
      </header>

      <div className="wl-layout">
        {/* Left: Form */}
        <aside className="wl-sidebar" aria-label="Add record form">
          <WishlistForm onAdd={addItem} />
        </aside>

        {/* Right: List */}
        <main className="wl-main" aria-label="Wishlist records" aria-live="polite">
          {/* Search bar */}
          <div className="wl-search-wrap">
            <label htmlFor="wl-search" className="sr-only">Search wishlist</label>
            <span className="wl-search-icon" aria-hidden="true">🔍</span>
            <input
              id="wl-search"
              type="search"
              className="wl-search"
              placeholder="Search album, artist or genre…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search wishlist records"
            />
          </div>

          {/* Loading state — 3G spinner */}
          {loading ? (
            <div className="wl-loading" role="status" aria-label="Loading wishlist">
              <div className="wl-spinner" aria-hidden="true" />
              <p>Loading wishlist…</p>
            </div>
          ) : items.length === 0 ? (
            // Empty state — no data found
            <div className="wl-empty" role="status">
              <div className="wl-empty-icon" aria-hidden="true">🎼</div>
              <h2 className="wl-empty-title">
                {query ? 'No records found' : 'Wishlist is empty'}
              </h2>
              <p className="wl-empty-msg">
                {query
                  ? `No results for "${query}". Try a different search term.`
                  : 'Add your first vinyl record using the form on the left.'}
              </p>
            </div>
          ) : (
            <ul className="wl-list" aria-label={`${items.length} records in wishlist`}>
              {items.map(item => (
                <li key={item.id} className="wl-list-item">
                  <WishlistItem
                    item={item}
                    onRemove={removeItem}
                    onMarkFound={markFound}
                  />
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  )
}
