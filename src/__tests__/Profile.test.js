import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Profile from '../pages/Profiles/Profile';
import useProfile from '../hooks/useProfile';
import '@testing-library/jest-dom/extend-expect';

// Mock the useProfile hook
jest.mock('../hooks/useProfile');

// Mock the ErrorModal and LoadingSpinner components
jest.mock('../components/ErrorModal', () => ({ message, onClose }) => (
  <div data-testid="error-modal">
    <p>{message}</p>
    <button onClick={onClose}>Close</button>
  </div>
));

jest.mock('../components/LoadingSpinner', () => () => (
  <div data-testid="loading-spinner">Loading...</div>
));

describe('Profile Component', () => {
  const mockProfileData = {
    profile: {
      id: 1,
      owner: 'testuser',
      image: 'https://via.placeholder.com/150',
      about_me: 'I love coding!',
      interest_name: 'Programming',
      posts_count: 5,
      followers_count: 10,
      following_count: 3,
      is_owner: true,
    },
    filteredPosts: [],
    filteredLikedPosts: [],
    loading: false,
    isFollowing: false,
    errorMessage: '',
    showErrorModal: false,
    handleFollow: jest.fn(),
    handleEditProfile: jest.fn(),
    setShowErrorModal: jest.fn(),
  };

  beforeEach(() => {
    useProfile.mockReturnValue(mockProfileData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading spinner when loading is true', () => {
    useProfile.mockReturnValueOnce({ ...mockProfileData, loading: true });

    render(<Profile />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should display the profile information correctly', async () => {
    render(<Profile />);

    // Check if the profile owner name is displayed
    expect(screen.getByRole('heading', { level: 1, name: 'testuser' })).toBeInTheDocument();

    // Check that the "About Me" section renders the multiline text correctly
    expect(screen.getByText('I love coding!')).toBeInTheDocument();

    // Check the interest section
    expect(screen.getByText('Main Interest:')).toBeInTheDocument();
    expect(screen.getByText('Programming')).toBeInTheDocument();

    // Check the stats section (posts, followers, following)
    expect(screen.getByText('5')).toBeInTheDocument();  // posts_count
    expect(screen.getByText('10')).toBeInTheDocument();  // followers_count
    expect(screen.getByText('3')).toBeInTheDocument();  // following_count
  });

  it('should display "No recent posts available" when there are no posts or liked posts', () => {
    render(<Profile />);

    const noRecentPostsElements = screen.getAllByText('No recent posts available.');
    expect(noRecentPostsElements).toHaveLength(2);  // Expect two instances
  });

  it('should call handleFollow when the follow button is clicked', () => {
    useProfile.mockReturnValueOnce({
      ...mockProfileData,
      profile: { ...mockProfileData.profile, is_owner: false },
      isFollowing: false,
    });

    render(<Profile />);

    const followButton = screen.getByText('Follow');
    expect(followButton).toBeInTheDocument();
    fireEvent.click(followButton);
    expect(mockProfileData.handleFollow).toHaveBeenCalled();
  });

  it('should call handleEditProfile when the edit profile button is clicked', () => {
    render(<Profile />);

    const editButton = screen.getByText('Edit Profile');
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    expect(mockProfileData.handleEditProfile).toHaveBeenCalled();
  });

  it('should show error modal when showErrorModal is true', () => {
    useProfile.mockReturnValueOnce({
      ...mockProfileData,
      showErrorModal: true,
      errorMessage: 'Error occurred!',
    });

    render(<Profile />);

    // Check if error modal is displayed
    expect(screen.getByTestId('error-modal')).toBeInTheDocument();
    expect(screen.getByText('Error occurred!')).toBeInTheDocument();

    // Close error modal
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(mockProfileData.setShowErrorModal).toHaveBeenCalledWith(false);
  });
});
