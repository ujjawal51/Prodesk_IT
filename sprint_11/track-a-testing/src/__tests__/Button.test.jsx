import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/Button';

describe('Track A - Phase 1: Button Component Unit Testing', () => {
  test('verifies Button mounts without crashing and renders text payload passed via props', () => {
    render(<Button>Click Me Test Payload</Button>);
    
    const buttonElement = screen.getByTestId('custom-button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent('Click Me Test Payload');
  });

  test('accurately applies variant styles based on prop', () => {
    const { rerender } = render(<Button variant="danger">Delete</Button>);
    expect(screen.getByTestId('custom-button')).toHaveClass('bg-red-600');

    rerender(<Button variant="secondary">Cancel</Button>);
    expect(screen.getByTestId('custom-button')).toHaveClass('bg-gray-700');
  });

  test('fires onClick callback when clicked by simulated user', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Submit</Button>);

    const button = screen.getByTestId('custom-button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('disables user interaction when disabled prop is true', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled CTA</Button>);

    const button = screen.getByTestId('custom-button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
