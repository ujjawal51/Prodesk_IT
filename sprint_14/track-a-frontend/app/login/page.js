'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import useAuthStore from '../../store/authStore';
import { authAPI } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const { setAuth, setLoading, isLoading } = useAuthStore();

  // ─── Form State ──────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ─── Handle Input Change ──────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  // ─── Client-Side Validation ───────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!formData.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Handle Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMsg('');

    if (!validate()) return;

    setLoading(true);
    try {
      // Phase 2: POST to /api/auth/login
      const data = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      // Phase 2: Persist JWT to Zustand store → localStorage
      setAuth(data.user, data.token);

      setSuccessMsg('✅ Login successful! Redirecting...');

      setTimeout(() => {
        router.push(redirectPath);
      }, 800);
    } catch (err) {
      const message =
        err?.response?.data?.message || 'Login failed. Please check your credentials.';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Hero Panel ──────────────────────────────────────────────────────── */}
      <aside className="auth-hero">
        <div className="auth-hero-content">
          <div className="auth-hero-icon">🛡️</div>
          <h1>Welcome Back</h1>
          <p>
            Sign in to your secure account. Your data is protected with
            JWT authentication and bcrypt password hashing.
          </p>
          <div className="auth-hero-badges">
            <span className="badge">🔑 JWT Token</span>
            <span className="badge">🔒 Encrypted</span>
            <span className="badge">⚡ Instant Access</span>
          </div>
        </div>
      </aside>

      {/* ── Form Panel ──────────────────────────────────────────────────────── */}
      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Sign In</h2>
            <p>Enter your credentials to access the dashboard</p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="alert alert-error" role="alert">
              ⚠️ {serverError}
            </div>
          )}

          {/* Success */}
          {successMsg && (
            <div className="alert alert-success" role="status">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                Email Address
              </label>
              <div className="form-input-wrapper">
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  autoComplete="email"
                  required
                />
                <span className="form-input-icon">✉️</span>
              </div>
              {errors.email && <p className="form-error">⚠ {errors.email}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
              <div className="form-input-wrapper">
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  autoComplete="current-password"
                  required
                />
                <span className="form-input-icon">🔒</span>
              </div>
              {errors.password && <p className="form-error">⚠ {errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner" />
                  Signing In...
                </>
              ) : (
                '🔑 Sign In'
              )}
            </button>
          </form>

          <div className="auth-footer">
            Don&apos;t have an account?{' '}
            <Link href="/register">Register here</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
