import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useHistory } from 'react-router-dom';
import BackButton from '../components/BackButton';

// Mock the useHistory hook
jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
}));

describe('BackButton component', () => {
  it('renders the back button with correct text and icon', () => {
    // Render the component
    render(<BackButton />);

    // Find elements by accessible roles and text
    const button = screen.getByRole('button', { name: /go back/i });
    const buttonText = screen.getByText(/back/i);

    // Assert the elements are rendered
    expect(button).toBeInTheDocument();
    expect(buttonText).toBeInTheDocument();
  });

  it('calls history.goBack when the button is clicked', () => {
    const goBack = jest.fn();

    // Mock the useHistory hook to return goBack
    useHistory.mockReturnValue({ goBack });

    // Render the component
    render(<BackButton />);

    // Find the button element
    const button = screen.getByRole('button', { name: /go back/i });

    // Simulate button click
    fireEvent.click(button);

    // Assert that goBack was called
    expect(goBack).toHaveBeenCalled();
  });
});
