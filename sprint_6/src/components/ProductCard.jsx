import { Link } from 'react-router-dom'
import { toINR } from '../utils/currency'

export default function ProductCard({ product }) {
  const discountPercent = Math.round(product.discountPercentage || 0)
  const originalPrice = product.price / (1 - discountPercent / 100)

  function stars(rating) {
    const full = Math.round(rating)
    return '★'.repeat(full) + '☆'.repeat(5 - full)
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card"
      aria-label={`${product.title} — ${toINR(product.price)}`}
      id={`product-card-${product.id}`}
    >
      <div className="product-card__img-wrap">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-card__img"
          loading="lazy"
        />
        {discountPercent > 0 && (
          <span className="product-card__discount-badge">
            -{discountPercent}%
          </span>
        )}
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__title">{product.title}</h3>

        <div className="product-card__rating">
          <span className="product-card__stars" aria-hidden="true">
            {stars(product.rating)}
          </span>
          <span aria-label={`Rating: ${product.rating} out of 5`}>
            {product.rating?.toFixed(1)}
          </span>
        </div>

        <div className="product-card__footer">
          <div>
            <span className="product-card__price">{toINR(product.price)}</span>
            {discountPercent > 0 && (
              <span className="product-card__original-price"> {toINR(originalPrice)}</span>
            )}
          </div>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            View →
          </span>
        </div>
      </div>
    </Link>
  )
}
