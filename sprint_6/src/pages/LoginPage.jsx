import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { isLoggedIn, loginAsGuest } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/shop'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  if (isLoggedIn) {
    navigate(from, { replace: true })
    return null
  }

  function asGuest() {
    loginAsGuest()
    navigate(from, { replace: true })
  }

  function submit(e) {
    e.preventDefault()
    const errs = {}
    if (!email.trim()) errs.email = 'Email is required'
    if (!password.trim()) errs.password = 'Password is required'
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    loginAsGuest()
    navigate(from, { replace: true })
  }

  return (
    <div className="page-wrapper">
      <div className="auth-page">
        <div className="auth-card" id="login-card">

          <div className="auth-card__icon" aria-hidden="true">🔐</div>

          <h1 className="auth-card__title">Welcome to ShopZone</h1>
          <p className="auth-card__subtitle">
            Sign in to access your cart, track orders, and checkout securely.
          </p>

          <form onSubmit={submit} noValidate aria-label="Login form" id="login-form">
            <div className="form-field" style={{ marginBottom: '12px' }}>
              <label htmlFor="login-email" className="form-label">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                placeholder="you@example.com"
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors(p => ({ ...p, email: '' }))
                }}
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'err-login-email' : undefined}
              />
              {errors.email && (
                <span id="err-login-email" className="form-error" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-field" style={{ marginBottom: '16px' }}>
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors(p => ({ ...p, password: '' }))
                }}
                aria-required="true"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'err-login-password' : undefined}
              />
              {errors.password && (
                <span id="err-login-password" className="form-error" role="alert">
                  {errors.password}
                </span>
              )}
            </div>

            <button type="submit" className="btn btn--primary btn--full" id="login-submit-btn">
              Sign In
            </button>
          </form>

          <div className="auth-divider">
            <span className="auth-divider__text">or</span>
          </div>

          <button className="btn btn--secondary btn--full" onClick={asGuest} id="guest-login-btn" aria-label="Login as Guest — no account required">
            👤 Login as Guest
          </button>

          <p className="auth-note">
            This is a mock authentication system.<br />
            No real credentials are stored or verified.
          </p>

        </div>
      </div>
    </div>
  )
}
