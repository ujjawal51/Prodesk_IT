import { Link } from 'react-router-dom'

/**
 * NotFoundPage — Route: * (catch-all)
 * Shown when user navigates to an unknown URL.
 */
export default function NotFoundPage() {
  return (
    <div className="page-wrapper">
      <div className="not-found">
        <div>
          <div className="not-found__code" aria-hidden="true">404</div>
          <h1 className="not-found__title">Page Not Found</h1>
          <p className="not-found__msg">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn btn--primary" id="not-found-home-btn">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
