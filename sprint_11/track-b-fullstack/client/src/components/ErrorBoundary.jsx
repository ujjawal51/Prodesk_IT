import React from 'react';
import { AlertTriangle, RefreshCw, ServerCrash } from 'lucide-react';

/**
 * Phase 2: Clean Error Boundary
 * Renders user-friendly diagnostic UI when the backend connection fails or React errors occur.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary Caught Exception]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError || this.props.backendError) {
      const errorMessage =
        this.props.backendError ||
        this.state.error?.message ||
        'Failed to establish communication with the Node.js / MongoDB REST API.';

      return (
        <div
          style={{
            margin: '40px auto',
            maxWidth: '640px',
            padding: '32px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              background: 'rgba(239, 68, 68, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--accent-rose)'
            }}
          >
            <ServerCrash size={28} />
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#fca5a5', marginBottom: '8px' }}>
            Backend Connection Failure
          </h3>

          <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
            {errorMessage}
          </p>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              fontSize: '12px',
              color: '#94a3b8',
              textAlign: 'left',
              marginBottom: '24px',
              fontFamily: 'monospace'
            }}
          >
            <div>• Ensure server is running: <span style={{ color: '#67e8f9' }}>node server.js</span> in <span style={{ color: '#a5b4fc' }}>server/</span></div>
            <div>• Target URL: <span style={{ color: '#67e8f9' }}>http://localhost:5000/api/posts</span></div>
            <div>• CORS Policy: Authorized for origin <span style={{ color: '#67e8f9' }}>http://localhost:5173</span></div>
          </div>

          <button
            type="button"
            onClick={this.handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'var(--primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
              transition: 'background 0.2s'
            }}
          >
            <RefreshCw size={16} /> Retry Connection
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
