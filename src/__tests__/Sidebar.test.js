import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Sidebar from '../components/Sidebar';
import { useCurrentUser, useSetCurrentUser } from '../context/CurrentUserContext';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock the current user context
jest.mock('../context/CurrentUserContext');

describe('Sidebar Component', () => {
  let mockSetCurrentUser;

  beforeEach(() => {
    // Reset the mock for each test
    mockSetCurrentUser = jest.fn();
    useSetCurrentUser.mockReturnValue(mockSetCurrentUser);
  });

  it('opens and closes the logout modal and confirms logout', async () => {
    // Mock an authenticated user
    useCurrentUser.mockReturnValue({ pk: 1, username: 'JohnDoe' });

    // Mock a successful axios post request
    axios.post.mockResolvedValueOnce({});

    // Render Sidebar
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} isMobile={false} />
      </MemoryRouter>
    );

    // Simulate click on the logout button
    const logoutButton = screen.getByLabelText('Logout');
    fireEvent.click(logoutButton);

    // Ensure the logout modal is opened
    expect(screen.getByText(/are you sure you want to log out/i)).toBeInTheDocument();

    // Simulate confirm logout button click
    const confirmLogoutButton = screen.getByText(/yes, log out/i);
    fireEvent.click(confirmLogoutButton);

    // Wait for the mockSetCurrentUser to be called
    await waitFor(() => {
      // Ensure setCurrentUser is called with null (indicating logout)
      expect(mockSetCurrentUser).toHaveBeenCalledWith(null);
    });
  });
});
