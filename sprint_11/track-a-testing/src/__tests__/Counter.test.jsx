import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from '../components/Counter';

describe('Track A - Phase 2: Interaction & Event Testing (State Mutation)', () => {
  test('Execution Criteria: does the DOM correctly render the mutated integer when user clicks Increment?', () => {
    render(<Counter initialValue={0} step={1} />);

    const counterDisplay = screen.getByTestId('counter-value');
    const incrementBtn = screen.getByTestId('increment-button');

    // 1. Verify initial state integer rendered in DOM
    expect(counterDisplay).toHaveTextContent('0');

    // 2. Simulate single click on "Increment" action
    fireEvent.click(incrementBtn);
    expect(counterDisplay).toHaveTextContent('1');

    // 3. Simulate consecutive clicks on "Increment" action
    fireEvent.click(incrementBtn);
    expect(counterDisplay).toHaveTextContent('2');

    fireEvent.click(incrementBtn);
    expect(counterDisplay).toHaveTextContent('3');
  });

  test('Execution Criteria: accurately mutates integer downwards upon simulated Decrement click', () => {
    render(<Counter initialValue={5} min={0} step={2} />);

    const counterDisplay = screen.getByTestId('counter-value');
    const decrementBtn = screen.getByTestId('decrement-button');

    expect(counterDisplay).toHaveTextContent('5');

    fireEvent.click(decrementBtn);
    expect(counterDisplay).toHaveTextContent('3');

    fireEvent.click(decrementBtn);
    expect(counterDisplay).toHaveTextContent('1');
  });

  test('resets counter to initial value upon Reset action', () => {
    render(<Counter initialValue={10} />);

    const counterDisplay = screen.getByTestId('counter-value');
    const incrementBtn = screen.getByTestId('increment-button');
    const resetBtn = screen.getByTestId('reset-button');

    fireEvent.click(incrementBtn);
    fireEvent.click(incrementBtn);
    expect(counterDisplay).toHaveTextContent('12');

    fireEvent.click(resetBtn);
    expect(counterDisplay).toHaveTextContent('10');
  });

  test('respects boundary constraints (min and max limits)', () => {
    render(<Counter initialValue={10} max={11} min={9} />);

    const incrementBtn = screen.getByTestId('increment-button');
    const decrementBtn = screen.getByTestId('decrement-button');
    const counterDisplay = screen.getByTestId('counter-value');

    // Increment to max
    fireEvent.click(incrementBtn);
    expect(counterDisplay).toHaveTextContent('11');
    expect(incrementBtn).toBeDisabled();

    // Decrement twice to min
    fireEvent.click(decrementBtn);
    expect(counterDisplay).toHaveTextContent('10');
    fireEvent.click(decrementBtn);
    expect(counterDisplay).toHaveTextContent('9');
    expect(decrementBtn).toBeDisabled();
  });
});
