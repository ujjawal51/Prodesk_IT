const PRIORITY_LABEL = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export default function WishlistItem({ item, onRemove, onMarkFound }) {
  const date = new Date(item.addedAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <article
      className={`wl-item ${item.found ? 'wl-item--found' : ''} wl-item--${item.priority}`}
      aria-label={`${item.album} by ${item.artist}`}
    >
      <div className="wl-item-left">
        <div className="wl-vinyl-icon" aria-hidden="true">🎵</div>
      </div>

      <div className="wl-item-body">
        <div className="wl-item-top">
          <div>
            <h3 className="wl-item-album">{item.album}</h3>
            <p className="wl-item-artist">{item.artist}</p>
          </div>
          <div className="wl-item-badges">
            <span className={`wl-badge wl-badge--${item.priority}`} aria-label={`Priority: ${PRIORITY_LABEL[item.priority]}`}>
              {PRIORITY_LABEL[item.priority]}
            </span>
            <span className="wl-badge wl-badge--genre">{item.genre}</span>
            {item.found && (
              <span className="wl-badge wl-badge--found" aria-label="Marked as found">Found ✓</span>
            )}
          </div>
        </div>

        {item.note && (
          <p className="wl-item-note" aria-label="Staff note">
            📝 {item.note}
          </p>
        )}

        <div className="wl-item-footer">
          <time className="wl-item-date" dateTime={new Date(item.addedAt).toISOString()}>
            Added {date}
          </time>
          <div className="wl-item-actions">
            <button
              className={`wl-btn-found ${item.found ? 'active' : ''}`}
              onClick={() => onMarkFound(item.id)}
              aria-pressed={item.found}
              aria-label={item.found ? 'Mark as not found' : 'Mark as found'}
            >
              {item.found ? '✓ Found' : 'Mark Found'}
            </button>
            <button
              className="wl-btn-remove"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${item.album} from wishlist`}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
