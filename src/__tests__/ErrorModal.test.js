import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorModal from '../components/ErrorModal'; 

describe('ErrorModal Component', () => {
  it('renders the error modal with default message', () => {
    // Render the component with default props
    render(<ErrorModal onClose={jest.fn()} />);

    // Check if the default error message is displayed
    expect(screen.getByText(/an unexpected error occurred\./i)).toBeInTheDocument();

    // Check if the Close button is present
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('renders the error modal with a custom message', () => {
    const customMessage = "Something went wrong. Please try again later.";

    // Render the component with a custom message
    render(<ErrorModal message={customMessage} onClose={jest.fn()} />);

    // Check if the custom error message is displayed
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('calls onClose when Close button is clicked', () => {
    const mockOnClose = jest.fn();

    // Render the component
    render(<ErrorModal onClose={mockOnClose} />);

    // Simulate clicking the Close button
    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    // Check if onClose is called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
