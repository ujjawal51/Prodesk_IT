import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import AsyncDataList from '../components/AsyncDataList';

describe('Track A - Phase 3: Network Mocking & Offline Resilience', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    jest.clearAllMocks();
    global.fetch = originalFetch;
  });

  test('Execution Criteria: explicitly mocks the network layer and renders payload offline', async () => {
    const mockPosts = [
      { id: '1', title: 'Fullstack MERN Integration', category: 'Engineering', content: 'Connecting Vite to Express REST API.' },
      { id: '2', title: 'Jest and RTL Automated Testing', category: 'QA Automation', content: 'Simulating user interaction and network mocks.' }
    ];

    // Explicit network layer mock: simulate successful HTTP 200 response
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: mockPosts })
      })
    );

    await act(async () => {
      render(<AsyncDataList endpoint="/api/posts" />);
    });

    // 1. Verify data rendered into DOM from mock
    expect(screen.getByTestId('items-list')).toBeInTheDocument();
    expect(screen.getByText('Fullstack MERN Integration')).toBeInTheDocument();
    expect(screen.getByText('Jest and RTL Automated Testing')).toBeInTheDocument();
    expect(screen.getByText('Connecting Vite to Express REST API.')).toBeInTheDocument();

    // 2. Verify fetch was called with correct endpoint
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/api/posts');
  });

  test('Execution Criteria: renders clean error state when network layer fails or returns 500', async () => {
    // Explicit network layer mock: simulate HTTP 500 server crash
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({ error: 'Database connection failed' })
      })
    );

    await act(async () => {
      render(<AsyncDataList endpoint="/api/posts" />);
    });

    const errorContainer = screen.getByTestId('error-state');
    expect(errorContainer).toBeInTheDocument();
    expect(errorContainer).toHaveTextContent('Server returned HTTP 500: Internal Server Error');
  });

  test('renders empty state when network layer returns empty dataset', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: [] })
      })
    );

    await act(async () => {
      render(<AsyncDataList endpoint="/api/posts" />);
    });

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText(/No records found in database/i)).toBeInTheDocument();
  });

  test('allows manual re-fetching via Refresh button', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: [{ id: '1', title: 'Post 1' }] })
      })
    );

    await act(async () => {
      render(<AsyncDataList endpoint="/api/posts" />);
    });

    expect(screen.getByText('Post 1')).toBeInTheDocument();

    // User clicks refresh button
    const refreshBtn = screen.getByTestId('refetch-button');
    await act(async () => {
      fireEvent.click(refreshBtn);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
