import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Enterprise Core Button Component
 * Engineered in strict isolation via Storybook (Track A)
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon = null,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold'
  };

  const variantStyles = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 focus:ring-indigo-500 border border-transparent',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-700 focus:ring-slate-500',
    outline: 'bg-transparent hover:bg-indigo-500/10 text-indigo-400 hover:text-indigo-300 border border-indigo-500/50 focus:ring-indigo-500',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/25 focus:ring-rose-500 border border-transparent',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-100 border border-transparent focus:ring-slate-600'
  };

  const disabledStyles = (disabled || isLoading)
    ? 'opacity-50 cursor-not-allowed pointer-events-none shadow-none transform-none'
    : 'cursor-pointer';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${disabledStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
