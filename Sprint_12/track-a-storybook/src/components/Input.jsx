import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Enterprise Core Input Field Component
 * Engineered in strict isolation via Storybook (Track A)
 */
export default function Input({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error = null,
  helperText = null,
  icon: Icon = null,
  className = '',
  required = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substring(2, 7)}`;
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </span>
        </label>
      )}

      {/* Input Shell */}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          type={effectiveType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 text-sm rounded-xl px-4 py-2.5 transition-all duration-200 border focus:outline-none focus:ring-2 ${
            Icon ? 'pl-10' : ''
          } ${
            isPassword ? 'pr-10' : ''
          } ${
            error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30'
              : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30'
          } ${
            disabled ? 'opacity-50 cursor-not-allowed bg-slate-950/80' : ''
          }`}
          {...props}
        />

        {/* Password visibility toggle */}
        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-slate-400 hover:text-slate-200 focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Error or Helper Text */}
      {error ? (
        <div className="flex items-center gap-1.5 text-rose-400 text-xs font-medium mt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <p className="text-slate-400 text-xs mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}
