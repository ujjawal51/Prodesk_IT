import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../components/Input';

describe('Track A - Phase 1 & 2: Input Component Unit & Event Keystroke Testing', () => {
  test('verifies Input mounts without crashing and renders label & placeholder', () => {
    render(
      <Input
        label="Post Title"
        name="title"
        placeholder="Enter blog post title..."
      />
    );

    expect(screen.getByTestId('custom-input-label')).toHaveTextContent('Post Title');
    const inputElement = screen.getByTestId('custom-input');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('placeholder', 'Enter blog post title...');
  });

  test('Execution Criteria: does input field state update upon simulated keystrokes?', () => {
    const handleChange = jest.fn();
    render(
      <Input
        label="Search Query"
        name="query"
        onChange={handleChange}
        placeholder="Search posts..."
      />
    );

    const input = screen.getByTestId('custom-input');

    // Simulate keystrokes: 'M', 'E', 'R', 'N'
    fireEvent.change(input, { target: { value: 'MERN Integration' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input.value).toBe('MERN Integration');
  });

  test('accurately displays error validation state when error prop is passed', () => {
    render(
      <Input
        label="Email"
        name="email"
        error="Invalid email address format"
      />
    );

    const errorMsg = screen.getByTestId('custom-input-error');
    expect(errorMsg).toBeInTheDocument();
    expect(errorMsg).toHaveTextContent('Invalid email address format');
    expect(screen.getByTestId('custom-input')).toHaveClass('border-red-500');
  });

  test('prevents typing interactions when disabled', () => {
    render(
      <Input
        label="Readonly Field"
        disabled
        value="Fixed Constant"
        onChange={jest.fn()}
      />
    );

    const input = screen.getByTestId('custom-input');
    expect(input).toBeDisabled();
  });
});
