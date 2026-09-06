import React, { useState } from 'react';

/**
 * Counter Component for Phase 2: Interaction & Event Testing
 * Handles user actions ("Increment", "Decrement", "Reset") and renders mutated integers.
 */
export default function Counter({
  initialValue = 0,
  step = 1,
  min = 0,
  max = 100
}) {
  const [count, setCount] = useState(initialValue);

  const handleIncrement = () => {
    setCount(prev => (prev + step <= max ? prev + step : prev));
  };

  const handleDecrement = () => {
    setCount(prev => (prev - step >= min ? prev - step : prev));
  };

  const handleReset = () => {
    setCount(initialValue);
  };

  return (
    <div
      data-testid="counter-container"
      className="p-6 rounded-2xl bg-gray-900 border border-gray-800 flex flex-col items-center gap-4 max-w-sm"
    >
      <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
        Stateful Counter
      </span>

      {/* The mutated integer in DOM */}
      <div
        data-testid="counter-value"
        className="text-5xl font-black text-white font-mono tracking-tight"
      >
        {count}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={count <= min}
          data-testid="decrement-button"
          aria-label="Decrement"
          className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          - Decrement
        </button>

        <button
          type="button"
          onClick={handleReset}
          data-testid="reset-button"
          aria-label="Reset"
          className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={count >= max}
          data-testid="increment-button"
          aria-label="Increment"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
        >
          + Increment
        </button>
      </div>

      <p className="text-xs text-gray-500">
        Range: [{min}, {max}] | Step: {step}
      </p>
    </div>
  );
}
