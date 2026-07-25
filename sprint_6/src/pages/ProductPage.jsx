import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { toINR } from '../utils/currency'

export default function ProductPage() {
  const { id } = useParams()
  const { dispatch, cartItems } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [added, setAdded] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  const alreadyInCart = cartItems.some(item => item.id === Number(id))

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setAdded(false)

    fetch(`https://dummyjson.com/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`Product not found (${res.status})`)
        return res.json()
      })
      .then(data => {
        if (!cancelled) {
          setProduct(data)
          setActiveImg(0)
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
  }, [id])

  function add() {
    if (!product) return
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        category: product.category,
      },
    })
    setAdded(true)
    console.log('[Analytics] User interacted with ShopZone — Add to Cart', product.id)
    setTimeout(() => setAdded(false), 2000)
  }

  function stars(rating) {
    const full = Math.round(rating || 0)
    return '★'.repeat(full) + '☆'.repeat(5 - full)
  }

  return (
    <div className="page-wrapper">
      <div className="container">

        <Link to="/shop" className="product-detail__back" id="back-to-shop-link">
          ← Back to Shop
        </Link>

        {loading && (
          <div className="spinner-wrap" role="status" aria-label="Loading product">
            <div className="spinner" aria-hidden="true" />
            <p>Loading product…</p>
          </div>
        )}

        {error && (
          <div
            role="alert"
            style={{
              background: 'var(--error-bg)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '32px',
              textAlign: 'center',
              color: 'var(--error)',
            }}
          >
            <p style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>
              {error}
            </p>
            <Link to="/shop" className="btn btn--secondary btn--sm" style={{ marginTop: '16px', display: 'inline-flex' }}>
              ← Back to Shop
            </Link>
          </div>
        )}

        {!loading && product && (
          <article className="product-detail" aria-label={product.title}>
            <div className="product-detail__grid">

              <div>
                <div className="product-detail__img-wrap">
                  <img
                    src={product.images?.[activeImg] || product.thumbnail}
                    alt={product.title}
                    className="product-detail__img"
                    id="product-detail-main-img"
                  />
                </div>

                {product.images?.length > 1 && (
                  <div
                    style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}
                    role="group"
                    aria-label="Product images"
                  >
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        aria-label={`View image ${i + 1}`}
                        aria-pressed={activeImg === i}
                        style={{
                          width: '64px',
                          height: '64px',
                          background: 'var(--bg-card)',
                          border: activeImg === i
                            ? '2px solid var(--accent)'
                            : '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '4px',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          transition: 'border-color 0.2s ease',
                        }}
                      >
                        <img
                          src={img}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="product-detail__info">
                <p className="product-detail__category">{product.category}</p>
                <h1 className="product-detail__title">{product.title}</h1>

                <div className="product-detail__rating">
                  <span style={{ color: 'var(--warning)', fontSize: '1rem' }} aria-hidden="true">
                    {stars(product.rating)}
                  </span>
                  <span aria-label={`Rating: ${product.rating} out of 5`}>
                    {product.rating?.toFixed(1)} / 5
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    ({product.reviews?.length || 0} reviews)
                  </span>
                </div>

                <div className="product-detail__price-block">
                  <span className="product-detail__price">{toINR(product.price)}</span>
                  {product.discountPercentage > 0 && (
                    <>
                      <span className="product-detail__original">
                        {toINR(product.price / (1 - product.discountPercentage / 100))}
                      </span>
                      <span className="product-detail__discount">
                        -{Math.round(product.discountPercentage)}% OFF
                      </span>
                    </>
                  )}
                </div>

                <p className="product-detail__description">{product.description}</p>

                <div className="product-detail__meta">
                  {[
                    { key: 'Brand', val: product.brand || 'N/A' },
                    { key: 'Stock', val: product.stock > 0 ? `${product.stock} units` : 'Out of Stock' },
                    { key: 'SKU', val: product.sku || 'N/A' },
                    { key: 'Availability', val: product.availabilityStatus || 'N/A' },
                  ].map(({ key, val }) => (
                    <div key={key} className="product-detail__meta-item">
                      <p className="product-detail__meta-key">{key}</p>
                      <p className="product-detail__meta-val">{val}</p>
                    </div>
                  ))}
                </div>

                <div className="product-detail__add-btn">
                  {alreadyInCart && !added ? (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <button
                        className="btn btn--primary btn--full"
                        onClick={add}
                        id="add-to-cart-btn"
                        aria-label={`Add another ${product.title} to cart`}
                      >
                        + Add One More
                      </button>
                      <Link
                        to="/cart"
                        className="btn btn--secondary"
                        style={{ whiteSpace: 'nowrap' }}
                        id="view-cart-btn"
                      >
                        View Cart →
                      </Link>
                    </div>
                  ) : (
                    <button
                      className="btn btn--primary btn--full"
                      onClick={add}
                      id="add-to-cart-btn"
                      aria-label={`Add ${product.title} to cart`}
                    >
                      🛒 Add to Cart
                    </button>
                  )}

                  {added && (
                    <div
                      className="add-to-cart-feedback"
                      role="status"
                      aria-live="polite"
                      style={{ marginTop: '12px' }}
                    >
                      ✓ Added to cart!
                    </div>
                  )}
                </div>

              </div>
            </div>
          </article>
        )}

      </div>
    </div>
  )
}
