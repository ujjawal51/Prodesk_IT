import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { toINR } from '../utils/currency'

export default function CartPage() {
  const { cartItems, totalItems, totalPrice, dispatch } = useCart()

  function inc(id) {
    dispatch({ type: 'INCREMENT_QTY', payload: id })
    console.log('[Analytics] User interacted with ShopZone — Cart increment', id)
  }

  function dec(id) {
    dispatch({ type: 'DECREMENT_QTY', payload: id })
    console.log('[Analytics] User interacted with ShopZone — Cart decrement', id)
  }

  function del(id) {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id })
    console.log('[Analytics] User interacted with ShopZone — Remove from Cart', id)
  }

  function clr() {
    dispatch({ type: 'CLEAR_CART' })
    console.log('[Analytics] User interacted with ShopZone — Cart cleared')
  }

  const shippingThreshold = 50
  const shippingUSD = totalPrice > shippingThreshold ? 0 : 5.99
  const taxUSD = totalPrice * 0.1
  const grandTotalUSD = totalPrice + shippingUSD + taxUSD

  return (
    <div className="page-wrapper">
      <div className="cart-page">
        <div className="container">
          <h1 className="cart-page__title">
            Shopping Cart
            {totalItems > 0 && (
              <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-muted)', marginLeft: '12px' }}>
                ({totalItems} item{totalItems !== 1 ? 's' : ''})
              </span>
            )}
          </h1>

          {cartItems.length === 0 ? (
            <div className="cart-empty" role="status">
              <div className="cart-empty__icon" aria-hidden="true">🛒</div>
              <h2 className="cart-empty__title">Your cart is empty</h2>
              <p className="cart-empty__msg">
                Looks like you haven't added any products yet.
              </p>
              <Link to="/shop" className="btn btn--primary" id="cart-empty-shop-btn">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="cart-layout">

              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                  <button className="btn btn--ghost btn--sm" onClick={clr} id="clear-cart-btn" aria-label="Clear all cart items">
                    🗑 Clear Cart
                  </button>
                </div>

                <ul className="cart-items" role="list" aria-label="Cart items">
                  {cartItems.map(item => (
                    <li key={item.id} className="cart-item" aria-label={item.title} id={`cart-item-${item.id}`}>
                      <img src={item.thumbnail} alt={item.title} className="cart-item__img" />

                      <div className="cart-item__info">
                        <p className="cart-item__category">{item.category}</p>
                        <h3 className="cart-item__title">{item.title}</h3>

                        <div className="cart-item__price-row">
                          <span className="cart-item__price">
                            {toINR(item.price * item.quantity)}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            ({toINR(item.price)} per item)
                          </span>
                        </div>
                      </div>

                      <div className="cart-item__qty-controls" aria-label={`Quantity: ${item.quantity}`}>
                        <button className="cart-item__qty-btn" onClick={() => dec(item.id)} aria-label="Decrease quantity" id={`decrement-btn-${item.id}`}>
                          −
                        </button>
                        <span className="cart-item__qty" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button className="cart-item__qty-btn" onClick={() => inc(item.id)} aria-label="Increase quantity" id={`increment-btn-${item.id}`}>
                          +
                        </button>
                      </div>

                      <button className="btn btn--danger btn--sm cart-item__remove" onClick={() => del(item.id)} aria-label={`Remove ${item.title} from cart`} id={`remove-btn-${item.id}`}>
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="cart-summary" aria-label="Order summary">
                <h2 className="cart-summary__title">Order Summary</h2>

                <div className="cart-summary__rows">
                  <div className="cart-summary__row">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>{toINR(totalPrice)}</span>
                  </div>
                  <div className="cart-summary__row">
                    <span>Shipping</span>
                    <span>{shippingUSD === 0 ? 'Free' : toINR(shippingUSD)}</span>
                  </div>
                  <div className="cart-summary__row">
                    <span>Tax (10%)</span>
                    <span>{toINR(taxUSD)}</span>
                  </div>
                  {shippingUSD === 0 && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--success)',
                      background: 'var(--success-bg)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '4px 8px',
                      textAlign: 'center',
                    }}>
                      ✓ Free delivery on orders above ₹4,200!
                    </div>
                  )}
                </div>

                <div className="cart-summary__total">
                  <span>Total</span>
                  <span>{toINR(grandTotalUSD)}</span>
                </div>

                <Link to="/checkout" className="btn btn--primary btn--full" id="proceed-checkout-btn">
                  Proceed to Checkout →
                </Link>

                <Link to="/shop" className="btn btn--ghost btn--full" style={{ marginTop: '8px' }} id="continue-shopping-btn">
                  Continue Shopping
                </Link>
              </aside>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}
