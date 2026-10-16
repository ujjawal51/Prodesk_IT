'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../store/authStore';
import { authAPI } from '../../lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth, setLoading, isLoading } = useAuthStore();

  // ─── Form State ──────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ─── Handle Input Change ──────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  // ─── Client-Side Validation ───────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      // Phase 2: POST to /api/auth/register
      const data = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Phase 2: Persist returned JWT to Zustand store (which persists to localStorage)
      setAuth(data.user, data.token);

      setSuccessMsg('🎉 Account created successfully! Redirecting...');

      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err) {
      const message =
        err?.response?.data?.message || 'Registration failed. Please try again.';
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
          <div className="auth-hero-icon">🔐</div>
          <h1>Join ProDesk IT</h1>
          <p>
            Create your secure account and get instant access to the protected
            dashboard powered by JWT authentication.
          </p>
          <div className="auth-hero-badges">
            <span className="badge">🔑 JWT Secured</span>
            <span className="badge">🛡️ bcrypt Hashed</span>
            <span className="badge">⚡ Next.js 14</span>
            <span className="badge">🗄️ MongoDB</span>
          </div>
        </div>
      </aside>

      {/* ── Form Panel ──────────────────────────────────────────────────────── */}
      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Create Account</h2>
            <p>Fill in your details to get started</p>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div className="alert alert-error" role="alert">
              ⚠️ {serverError}
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div className="alert alert-success" role="status">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <div className="form-input-wrapper">
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  autoComplete="name"
                  required
                />
                <span className="form-input-icon">👤</span>
              </div>
              {errors.name && (
                <p className="form-error">⚠ {errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="register-email" className="form-label">
                Email Address
              </label>
              <div className="form-input-wrapper">
                <input
                  id="register-email"
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
              {errors.email && (
                <p className="form-error">⚠ {errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="register-password" className="form-label">
                Password
              </label>
              <div className="form-input-wrapper">
                <input
                  id="register-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  autoComplete="new-password"
                  required
                />
                <span className="form-input-icon">🔒</span>
              </div>
              {errors.password && (
                <p className="form-error">⚠ {errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirm-password" className="form-label">
                Confirm Password
              </label>
              <div className="form-input-wrapper">
                <input
                  id="confirm-password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  autoComplete="new-password"
                  required
                />
                <span className="form-input-icon">🔒</span>
              </div>
              {errors.confirmPassword && (
                <p className="form-error">⚠ {errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="register-submit-btn"
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner" />
                  Creating Account...
                </>
              ) : (
                '🚀 Create Account'
              )}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link href="/login">Sign in here</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
