import React from 'react';

/**
 * Input component for Track A interaction & event testing
 * Verifies simulated keystroke state updates and prop rendering.
 */
export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error,
  disabled = false,
  dataTestId = 'custom-input',
  id,
  className = '',
  ...rest
}) {
  const inputId = id || `input-${name || 'field'}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          data-testid={`${dataTestId}-label`}
          className="text-sm font-medium text-gray-300"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        data-testid={dataTestId}
        className={`px-3.5 py-2 rounded-lg bg-gray-800 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition duration-150 ${
          error
            ? 'border-red-500 focus:ring-red-400'
            : 'border-gray-700 focus:ring-blue-500 focus:border-blue-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-900' : ''}`}
        {...rest}
      />

      {error && (
        <span
          data-testid={`${dataTestId}-error`}
          className="text-xs text-red-400 font-medium mt-0.5"
        >
          {error}
        </span>
      )}
    </div>
  );
}
