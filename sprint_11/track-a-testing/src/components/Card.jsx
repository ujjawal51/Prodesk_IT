import React from 'react';

/**
 * Card component for Track A UI suite
 * Verifies mounting without crashing and accurate text payload rendering passed via props.
 */
export default function Card({
  title,
  description,
  badge,
  category = 'General',
  onAction,
  actionLabel = 'Explore',
  className = '',
  dataTestId = 'custom-card'
}) {
  return (
    <div
      data-testid={dataTestId}
      className={`bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span
            data-testid="card-category"
            className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-900/50 text-blue-400 border border-blue-800"
          >
            {category}
          </span>
          {badge && (
            <span
              data-testid="card-badge"
              className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-400"
            >
              {badge}
            </span>
          )}
        </div>

        <h3
          data-testid="card-title"
          className="text-xl font-bold text-white mb-2 tracking-tight"
        >
          {title}
        </h3>

        {description && (
          <p
            data-testid="card-description"
            className="text-gray-400 text-sm leading-relaxed mb-4"
          >
            {description}
          </p>
        )}
      </div>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          data-testid="card-action-button"
          className="mt-2 w-full py-2 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-semibold transition duration-150 text-center"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
