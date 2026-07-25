import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { toINR } from '../utils/currency'

const initialShipping = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', city: '', pincode: '', country: 'India',
}

function val(f) {
  const errs = {}
  if (!f.firstName.trim()) errs.firstName = 'Required'
  if (!f.lastName.trim()) errs.lastName = 'Required'
  if (!f.email.trim()) errs.email = 'Required'
  if (!f.address.trim()) errs.address = 'Required'
  if (!f.city.trim()) errs.city = 'Required'
  if (!f.pincode.trim()) errs.pincode = 'Required'
  return errs
}

export default function CheckoutPage() {
  const { cartItems, totalPrice, totalItems, dispatch } = useCart()
  const { user } = useAuth()

  const [fields, setFields] = useState(initialShipping)
  const [errors, setErrors] = useState({})
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId] = useState(() =>
    'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase()
  )

  const shippingUSD = totalPrice > 50 ? 0 : 5.99
  const taxUSD = totalPrice * 0.1
  const grandTotalUSD = totalPrice + shippingUSD + taxUSD

  function change(e) {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function submit(e) {
    e.preventDefault()
    const errs = val(fields)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setOrderPlaced(true)
    dispatch({ type: 'CLEAR_CART' })
    console.log('[Analytics] User interacted with ShopZone — Order placed', orderId)
  }

  if (orderPlaced) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="checkout-success">
            <div className="checkout-success__icon" aria-hidden="true">✓</div>
            <h1 className="checkout-success__title">Order Placed! 🎉</h1>
            <p className="checkout-success__msg">
              Thank you, {user?.name}! Your order <strong>{orderId}</strong> has
              been placed successfully. You'll receive a confirmation shortly.
            </p>
            <Link to="/shop" className="btn btn--primary btn--lg" id="order-success-shop-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="checkout-page">
        <div className="container">
          <h1 className="checkout-page__title">Checkout</h1>

          <div className="checkout-layout">

            <form onSubmit={submit} noValidate aria-label="Checkout shipping form" id="checkout-form">
              <div className="checkout-section">
                <h2 className="checkout-section__title">Shipping Details</h2>
                <div className="form-grid">

                  <div className="form-field">
                    <label htmlFor="checkout-firstName" className="form-label">
                      First Name <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="checkout-firstName"
                      name="firstName"
                      type="text"
                      className={`form-input ${errors.firstName ? 'form-input--error' : ''}`}
                      placeholder="Rahul"
                      value={fields.firstName}
                      onChange={change}
                      aria-required="true"
                    />
                    {errors.firstName && <span className="form-error" role="alert">{errors.firstName}</span>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="checkout-lastName" className="form-label">
                      Last Name <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="checkout-lastName"
                      name="lastName"
                      type="text"
                      className={`form-input ${errors.lastName ? 'form-input--error' : ''}`}
                      placeholder="Sharma"
                      value={fields.lastName}
                      onChange={change}
                      aria-required="true"
                    />
                    {errors.lastName && <span className="form-error" role="alert">{errors.lastName}</span>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="checkout-email" className="form-label">
                      Email <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="checkout-email"
                      name="email"
                      type="email"
                      className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                      placeholder="rahul@example.com"
                      value={fields.email}
                      onChange={change}
                      aria-required="true"
                    />
                    {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="checkout-phone" className="form-label">Phone</label>
                    <input
                      id="checkout-phone"
                      name="phone"
                      type="tel"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={fields.phone}
                      onChange={change}
                    />
                  </div>

                  <div className="form-field form-field--full">
                    <label htmlFor="checkout-address" className="form-label">
                      Address <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="checkout-address"
                      name="address"
                      type="text"
                      className={`form-input ${errors.address ? 'form-input--error' : ''}`}
                      placeholder="Street, Building, Floor…"
                      value={fields.address}
                      onChange={change}
                      aria-required="true"
                    />
                    {errors.address && <span className="form-error" role="alert">{errors.address}</span>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="checkout-city" className="form-label">
                      City <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="checkout-city"
                      name="city"
                      type="text"
                      className={`form-input ${errors.city ? 'form-input--error' : ''}`}
                      placeholder="New Delhi"
                      value={fields.city}
                      onChange={change}
                      aria-required="true"
                    />
                    {errors.city && <span className="form-error" role="alert">{errors.city}</span>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="checkout-pincode" className="form-label">
                      Pincode <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="checkout-pincode"
                      name="pincode"
                      type="text"
                      className={`form-input ${errors.pincode ? 'form-input--error' : ''}`}
                      placeholder="110001"
                      value={fields.pincode}
                      onChange={change}
                      aria-required="true"
                      maxLength={10}
                    />
                    {errors.pincode && <span className="form-error" role="alert">{errors.pincode}</span>}
                  </div>

                </div>
              </div>

              <div className="checkout-section">
                <h2 className="checkout-section__title">Payment Method</h2>
                <div style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--accent)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.875rem',
                  color: 'var(--accent-light)',
                }}>
                  <span aria-hidden="true">💳</span>
                  Cash on Delivery (Mock — No real payment processed)
                </div>
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--full btn--lg"
                id="place-order-btn"
                disabled={cartItems.length === 0}
              >
                Place Order — {toINR(grandTotalUSD)}
              </button>
            </form>

            <aside className="cart-summary" aria-label="Order summary">
              <h2 className="cart-summary__title">
                Your Order ({totalItems} item{totalItems !== 1 ? 's' : ''})
              </h2>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginBottom: '16px',
                maxHeight: '300px',
                overflowY: 'auto',
              }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      style={{
                        width: '44px',
                        height: '44px',
                        objectFit: 'contain',
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-xs)',
                        padding: '4px',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.title}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ×{item.quantity}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                      {toINR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="cart-summary__rows">
                <div className="cart-summary__row">
                  <span>Subtotal</span>
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
              </div>

              <div className="cart-summary__total">
                <span>Grand Total</span>
                <span>{toINR(grandTotalUSD)}</span>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </div>
  )
}
