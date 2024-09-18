import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useHistory } from 'react-router-dom';
import BackButton from '../components/BackButton'; // Adjust the path based on your file structure

// Mock useHistory hook
jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
}));

describe('BackButton Component', () => {
  it('should render the back button and handle back navigation', () => {
    const mockGoBack = jest.fn(); // Mock the goBack function
    useHistory.mockReturnValue({ goBack: mockGoBack });

    // Render the BackButton component
    render(<BackButton />);

    // Get the button element by its text "Back"
    const backButton = screen.getByRole('button', { name: /back/i });

    // Assert that the back button is in the document
    expect(backButton).toBeInTheDocument();

    // Simulate a click event on the button
    fireEvent.click(backButton);

    // Assert that history.goBack was called when the button was clicked
    expect(mockGoBack).toHaveBeenCalled();
  });
});
