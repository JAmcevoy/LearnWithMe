import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteModal from '../components/DeleteModal'; 

describe('DeleteModal Component', () => {
  it('renders the delete modal with default message', () => {
    // Render the component
    render(<DeleteModal onConfirm={jest.fn()} onCancel={jest.fn()} />);

    // Check if the default message is displayed
    expect(screen.getByText(/are you sure you want to delete this\?/i)).toBeInTheDocument();

    // Check if the Confirm and Cancel buttons are present
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('renders the delete modal with a custom message', () => {
    const customMessage = "Do you really want to remove this item?";

    // Render the component with custom message
    render(<DeleteModal message={customMessage} onConfirm={jest.fn()} onCancel={jest.fn()} />);

    // Check if the custom message is displayed
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('calls onConfirm when Confirm button is clicked', () => {
    const mockOnConfirm = jest.fn();

    // Render the component
    render(<DeleteModal onConfirm={mockOnConfirm} onCancel={jest.fn()} />);

    // Simulate clicking the Confirm button
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

    // Verify that onConfirm is called
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when Cancel button is clicked', () => {
    const mockOnCancel = jest.fn();

    // Render the component
    render(<DeleteModal onConfirm={jest.fn()} onCancel={mockOnCancel} />);

    // Simulate clicking the Cancel button
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    // Verify that onCancel is called
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
