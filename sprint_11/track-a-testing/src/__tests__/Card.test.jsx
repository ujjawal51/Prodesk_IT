import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../components/Card';

describe('Track A - Phase 1: Card Component Unit Testing', () => {
  const mockPayload = {
    title: 'Inception (2010)',
    description: 'A thief who steals corporate secrets through dream-sharing technology.',
    category: 'Sci-Fi',
    badge: 'Trending #1'
  };

  test('verifies Card mounts without crashing and renders text payloads passed via props', () => {
    render(
      <Card
        title={mockPayload.title}
        description={mockPayload.description}
        category={mockPayload.category}
        badge={mockPayload.badge}
      />
    );

    expect(screen.getByTestId('custom-card')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toHaveTextContent('Inception (2010)');
    expect(screen.getByTestId('card-description')).toHaveTextContent(mockPayload.description);
    expect(screen.getByTestId('card-category')).toHaveTextContent('Sci-Fi');
    expect(screen.getByTestId('card-badge')).toHaveTextContent('Trending #1');
  });

  test('handles omitted optional props gracefully without crashing', () => {
    render(<Card title="Minimalist Card" />);
    
    expect(screen.getByTestId('card-title')).toHaveTextContent('Minimalist Card');
    expect(screen.queryByTestId('card-badge')).not.toBeInTheDocument();
    expect(screen.queryByTestId('card-description')).not.toBeInTheDocument();
  });

  test('executes onAction callback upon simulated user interaction', () => {
    const handleAction = jest.fn();
    render(
      <Card
        title="Interactive Card"
        actionLabel="View Details"
        onAction={handleAction}
      />
    );

    const actionBtn = screen.getByTestId('card-action-button');
    expect(actionBtn).toHaveTextContent('View Details');

    fireEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
