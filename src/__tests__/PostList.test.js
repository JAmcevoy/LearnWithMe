import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PostList from '../pages/Posts/PostList';
import usePostContent from '../hooks/usePostList';
import '@testing-library/jest-dom/extend-expect';

// Mock the usePostContent hook
jest.mock('../hooks/usePostList', () => jest.fn());

// Mock the components
jest.mock('react-infinite-scroll-component', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/SearchBar', () => ({ searchQuery, onSearchChange, onClearFilters }) => (
  <div>
    <input
      data-testid="search-input"
      value={searchQuery}
      onChange={onSearchChange}
    />
    <button onClick={onClearFilters}>Clear Filters</button>
  </div>
));
jest.mock('../pages/Posts/PostItem', () => ({ post, onPostClick, onToggleLike }) => (
  <div data-testid="post-item">
    <h2>{post.title}</h2>
    <button onClick={() => onPostClick(post.id)}>View Post</button>
    <button onClick={() => onToggleLike(post.id, post.is_liked, post.like_id)}>
      {post.is_liked ? 'Unlike' : 'Like'}
    </button>
  </div>
));
jest.mock('../components/LoadingSpinner', () => () => <div data-testid="loading-spinner">Loading...</div>);
jest.mock('../components/ErrorModal', () => ({ message, onClose }) => (
  <div data-testid="error-modal">
    <p>{message}</p>
    <button onClick={onClose}>Close</button>
  </div>
));

describe('PostList Component', () => {
  const mockPostData = {
    posts: {
      results: [
        { id: 1, title: 'First Post', owner: 'User1', is_liked: false, likes_count: 0, like_id: null },
        { id: 2, title: 'Second Post', owner: 'User2', is_liked: true, likes_count: 1, like_id: 100 },
      ],
      next: null,
    },
    filteredPosts: [
      { id: 1, title: 'First Post', owner: 'User1', is_liked: false, likes_count: 0, like_id: null },
      { id: 2, title: 'Second Post', owner: 'User2', is_liked: true, likes_count: 1, like_id: 100 },
    ],
    loading: false,
    error: '',
    searchQuery: '',
    handlePostClick: jest.fn(),
    toggleLike: jest.fn(),
    handleSearchChange: jest.fn(),
    handleClearFilters: jest.fn(),
    handleCloseModal: jest.fn(),
    setPosts: jest.fn(),
  };

  beforeEach(() => {
    usePostContent.mockReturnValue(mockPostData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display posts and allow interacting with them', () => {
    render(<PostList />);

    // Check that posts are displayed
    const postItems = screen.getAllByTestId('post-item');
    expect(postItems).toHaveLength(2);

    // Interact with the "View Post" button
    fireEvent.click(screen.getAllByText('View Post')[0]); // First "View Post" button
    expect(mockPostData.handlePostClick).toHaveBeenCalledWith(1);

    // Interact with the "Like" button
    fireEvent.click(screen.getAllByText('Like')[0]); // First "Like" button
    expect(mockPostData.toggleLike).toHaveBeenCalledWith(1, false, null);

    // Interact with the "Unlike" button
    fireEvent.click(screen.getAllByText('Unlike')[0]); // First "Unlike" button
    expect(mockPostData.toggleLike).toHaveBeenCalledWith(2, true, 100);
  });

  it('should display search bar and filter posts', () => {
    render(<PostList />);

    // Check that search bar is displayed
    const searchInput = screen.getByTestId('search-input');
    expect(searchInput).toBeInTheDocument();

    // Simulate typing in the search bar
    fireEvent.change(searchInput, { target: { value: 'Test Query' } });
    expect(mockPostData.handleSearchChange).toHaveBeenCalled();
  });

  it('should display an error modal when there is an error', () => {
    // Update mock to return error state
    usePostContent.mockReturnValueOnce({ ...mockPostData, error: 'Something went wrong!' });

    render(<PostList />);

    // Check if error modal is displayed
    expect(screen.getByTestId('error-modal')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();

    // Close the error modal
    fireEvent.click(screen.getByText('Close'));
    expect(mockPostData.handleCloseModal).toHaveBeenCalled();
  });

  it('should display "No Posts Found" when there are no filtered posts and a search query is present', () => {
    // Update mock to simulate no filtered posts with a search query
    usePostContent.mockReturnValueOnce({ ...mockPostData, filteredPosts: [], searchQuery: 'Test Query' });

    render(<PostList />);

    // Assert "No Posts Found" message is displayed
    expect(screen.getByText('No Posts Found for "Test Query"')).toBeInTheDocument();
    expect(screen.getByText('Please try clearing the search bar or adjusting your search query.')).toBeInTheDocument();
  });
});
