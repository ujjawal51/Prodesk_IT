import React, { useState, useEffect, useCallback } from 'react';

/**
 * AsyncDataList Component for Phase 3: Network Mocking & Coverage Reports
 * Executes an asynchronous network call via fetch.
 * Explicitly tested with mocked fetch layer to ensure offline execution.
 */
export default function AsyncDataList({
  endpoint = '/api/posts',
  autoFetch = true
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}: ${res.statusText || 'Fetch Error'}`);
      }
      const json = await res.json();
      // Handle both wrapped { data: [...] } or direct array [...]
      const items = Array.isArray(json) ? json : json.data || [];
      setData(items);
    } catch (err) {
      setError(err.message || 'Network request failed');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return (
    <div
      data-testid="async-data-container"
      className="p-6 rounded-xl bg-gray-900 border border-gray-800 text-white w-full max-w-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Network Hydrated Feed</h3>
        <button
          type="button"
          onClick={fetchData}
          data-testid="refetch-button"
          className="px-3 py-1 text-xs rounded bg-blue-600 hover:bg-blue-500 font-semibold"
        >
          Refresh Data
        </button>
      </div>

      {loading && (
        <div
          data-testid="loading-state"
          className="py-6 text-center text-gray-400 animate-pulse font-medium"
        >
          Loading payload from network...
        </div>
      )}

      {error && (
        <div
          data-testid="error-state"
          role="alert"
          className="p-4 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-sm mb-4"
        >
          <span className="font-bold">Error: </span>
          {error}
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div
          data-testid="empty-state"
          className="py-6 text-center text-gray-500 text-sm"
        >
          No records found in database.
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <ul data-testid="items-list" className="divide-y divide-gray-800">
          {data.map((item, idx) => (
            <li
              key={item.id || item._id || idx}
              data-testid={`item-row-${item.id || item._id || idx}`}
              className="py-3 flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-200">
                  {item.title}
                </span>
                {item.category && (
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-blue-400">
                    {item.category}
                  </span>
                )}
              </div>
              {item.content && (
                <p className="text-xs text-gray-400 line-clamp-2">
                  {item.content}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
