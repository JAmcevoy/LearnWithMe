import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Chats from '../pages/Circles/Chats';
import useMessages from '../hooks/useMessages';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';

// Mock the useMessages hook
jest.mock('../hooks/useMessages');

// Mock the external components
jest.mock('../components/LoadingSpinner', () => () => <div data-testid="loading-spinner">Loading...</div>);

// Mock the DeleteConfirmation component like you did with the loader
jest.mock('../components/DeleteModal', () => ({ message, onConfirm, onCancel }) => (
  <div data-testid="delete-modal">
    <p>{message}</p>
    <button onClick={onCancel}>Cancel</button>
    <button onClick={onConfirm}>Confirm</button>
  </div>
));

describe('Chats Component', () => {
  const mockChatData = {
    currentUser: { pk: 1 },
    messages: {
      results: [
        { id: 1, owner: 1, owner_username: 'testuser', content: 'Hello, World!', timestamp: '2024-09-14' },
        { id: 2, owner: 2, owner_username: 'otheruser', content: 'Hey there!', timestamp: '2024-09-14' },
      ],
      next: null,
    },
    newMessage: 'Test message',
    editingMessageId: null,
    loading: false,
    error: null,
    showDeleteModal: false,
    circleName: 'Test Circle',
    messagesEndRef: { current: null },
    handleChange: jest.fn(),
    handleSend: jest.fn(),
    handleDeleteClick: jest.fn(),
    handleDeleteCancel: jest.fn(),
    handleKeyPress: jest.fn(),
    fetchMoreMessages: jest.fn(),
    handleDeleteConfirm: jest.fn(),
    setEditingMessageId: jest.fn(),
    setError: jest.fn(),
  };

  beforeEach(() => {
    useMessages.mockReturnValue(mockChatData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading spinner when loading is true', () => {
    useMessages.mockReturnValueOnce({
      ...mockChatData,
      loading: true,
      messages: { results: [] }, // Simulate no messages when loading
    });

    render(<Chats />, { wrapper: MemoryRouter });

    // Assert that the loading spinner is displayed
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should call handleSend when the send button is clicked', () => {
    render(<Chats />, { wrapper: MemoryRouter });

    const sendButton = screen.getByLabelText('Send message');
    expect(sendButton).not.toBeDisabled();

    fireEvent.click(sendButton);

    expect(mockChatData.handleSend).toHaveBeenCalled();
  });

  it('should show delete modal when showDeleteModal is true', () => {
    useMessages.mockReturnValueOnce({
      ...mockChatData,
      showDeleteModal: true, // Ensure the modal is set to show
    });

    render(<Chats />, { wrapper: MemoryRouter });

    // Assert that the delete modal is displayed
    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
  });

  it('should call handleDeleteClick when delete button is clicked', () => {
    render(<Chats />, { wrapper: MemoryRouter });

    const deleteButton = screen.getAllByLabelText('Delete message')[0];
    fireEvent.click(deleteButton);

    expect(mockChatData.handleDeleteClick).toHaveBeenCalled();
  });

  it('should display messages', () => {
    render(<Chats />, { wrapper: MemoryRouter });

    // Check if the messages are rendered
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
    expect(screen.getByText('Hey there!')).toBeInTheDocument();
  });

  it('should allow editing a message', () => {
    render(<Chats />, { wrapper: MemoryRouter });

    const editButton = screen.getAllByLabelText('Edit message')[0];
    fireEvent.click(editButton);

    expect(mockChatData.setEditingMessageId).toHaveBeenCalledWith(1);
  });
});
