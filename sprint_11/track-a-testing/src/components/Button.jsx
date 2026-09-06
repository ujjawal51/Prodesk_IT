import React from 'react';

/**
 * Button component for Track A UI suite
 * Supports variants (primary, secondary, danger, outline), disabled states, and click handlers.
 */
export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
  dataTestId = 'custom-button',
  ...rest
}) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline: "border border-gray-600 text-gray-200 hover:bg-gray-800 focus:ring-gray-500"
  };

  const selectedVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-testid={dataTestId}
      className={`${baseStyles} ${selectedVariant} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
