import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LogoutModal from '../components/LogoutModal';

describe('LogoutModal Component', () => {
  it('renders the modal when isOpen is true', () => {
    // Render the component with isOpen as true
    render(<LogoutModal isOpen={true} onClose={jest.fn()} onConfirm={jest.fn()} />);

    // Check if the modal content is displayed
    expect(screen.getByText(/are you sure you want to log out\?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /yes, log out/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('does not render the modal when isOpen is false', () => {
    // Render the component with isOpen as false
    render(<LogoutModal isOpen={false} onClose={jest.fn()} onConfirm={jest.fn()} />);

    // Check if the modal content is NOT displayed
    expect(screen.queryByText(/are you sure you want to log out\?/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /yes, log out/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });

  it('calls onConfirm when the "Yes, Log Out" button is clicked', () => {
    const mockOnConfirm = jest.fn();

    // Render the component with isOpen as true
    render(<LogoutModal isOpen={true} onClose={jest.fn()} onConfirm={mockOnConfirm} />);

    // Simulate clicking the "Yes, Log Out" button
    fireEvent.click(screen.getByRole('button', { name: /yes, log out/i }));

    // Check if onConfirm was called
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the "Cancel" button is clicked', () => {
    const mockOnClose = jest.fn();

    // Render the component with isOpen as true
    render(<LogoutModal isOpen={true} onClose={mockOnClose} onConfirm={jest.fn()} />);

    // Simulate clicking the "Cancel" button
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
