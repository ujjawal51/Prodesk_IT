import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';

export default function StepTwo({ register, errors, watch }) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const pwd = watch('password') || '';

  const getScore = (val) => {
    if (!val) return 0;
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) s++;
    if (/\d/.test(val) || /[^A-Za-z0-9]/.test(val)) s++;
    return s;
  };

  const score = getScore(pwd);

  return (
    <div className="step-content">
      <div className="step-header">
        <h2>
          <Lock size={22} /> Account Details
        </h2>
        <p>Set up your login credentials.</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <div className="input-wrapper">
            <Mail size={18} className="input-icon" />
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className={`input-field ${errors.email ? 'has-error' : ''}`}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <span className="error-message">
              <AlertCircle size={14} /> {errors.email.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <div className="input-wrapper">
            <Lock size={18} className="input-icon" />
            <input
              id="password"
              type={showPass ? 'text' : 'password'}
              placeholder="Min 8 characters"
              className={`input-field ${errors.password ? 'has-error' : ''}`}
              {...register('password')}
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPass(!showPass)}
              tabIndex={-1}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {pwd && (
            <div style={{ marginTop: '0.35rem' }}>
              <div className="strength-bar-container">
                <div className={`strength-segment ${score >= 1 ? 'active-weak' : ''}`} />
                <div className={`strength-segment ${score >= 2 ? 'active-medium' : ''}`} />
                <div className={`strength-segment ${score >= 3 ? 'active-strong' : ''}`} />
              </div>
            </div>
          )}

          {errors.password && (
            <span className="error-message">
              <AlertCircle size={14} /> {errors.password.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
          <div className="input-wrapper">
            <ShieldCheck size={18} className="input-icon" />
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter password"
              className={`input-field ${errors.confirmPassword ? 'has-error' : ''}`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowConfirm(!showConfirm)}
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="error-message">
              <AlertCircle size={14} /> {errors.confirmPassword.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
