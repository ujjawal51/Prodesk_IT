import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { totalItems } = useCart()
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()

  function out() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar__inner">

        <Link to="/" className="navbar__brand" aria-label="ShopZone Home">
          <div className="navbar__brand-icon" aria-hidden="true">🛍️</div>
          <span className="navbar__brand-name">ShopZone</span>
        </Link>

        <ul className="navbar__links" role="list">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              Shop
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              Contact
            </NavLink>
          </li>
        </ul>

        <div className="navbar__actions">
          <Link
            to="/cart"
            className="navbar__cart-btn"
            aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
            id="navbar-cart-btn"
          >
            <span className="navbar__cart-icon" aria-hidden="true">🛒</span>
            <span>Cart</span>
            {totalItems > 0 && (
              <span
                className="navbar__cart-badge"
                aria-live="polite"
                key={totalItems}
              >
                {totalItems}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <>
              <div className="navbar__user-pill" aria-label={`Logged in as ${user?.name}`}>
                <span aria-hidden="true">✓</span>
                {user?.name}
              </div>
              <button
                className="btn btn--secondary btn--sm"
                onClick={out}
                id="navbar-logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar__auth-btn" id="navbar-login-btn">
              Login
            </Link>
          )}
        </div>

      </div>
    </nav>
  )
}
