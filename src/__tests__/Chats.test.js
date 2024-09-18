import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Chats from '../pages/circles/Chats';
import useMessages from '../hooks/useMessages';

// Mock the useMessages hook
jest.mock('../hooks/useMessages', () => jest.fn());

describe('Chats Component', () => {
  const mockUseMessages = {
    currentUser: { pk: 1 },
    messages: { results: [] }, // No messages for the loading test
    newMessage: '',
    error: null,
    showDeleteModal: false,
    circleName: 'Test Circle',
    messagesEndRef: React.createRef(),
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
    useMessages.mockReturnValue(mockUseMessages);
  });

  it('should render the chat interface with messages', () => {
    mockUseMessages.messages.results = [{ id: 1, owner: 1, owner_username: 'Test User', content: 'Hello!', timestamp: new Date() }];
    
    render(
      <MemoryRouter>
        <Chats />
      </MemoryRouter>
    );

    // Check if the chat header is rendered
    expect(screen.getByText('Test Circle Chat')).toBeInTheDocument();
    
    // Check if the message is rendered
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });

  it('should enable the send button when message input is not empty', () => {
    mockUseMessages.newMessage = 'Hello!';

    render(
      <MemoryRouter>
        <Chats />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled();
  });

  it('should display delete confirmation modal when deleting a message', () => {
    mockUseMessages.showDeleteModal = true;

    render(
      <MemoryRouter>
        <Chats />
      </MemoryRouter>
    );

    expect(screen.getByText(/are you sure you want to delete this message/i)).toBeInTheDocument();
  });

  it('should display error modal when there is an error', () => {
    mockUseMessages.error = 'An error occurred';

    render(
      <MemoryRouter>
        <Chats />
      </MemoryRouter>
    );

    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('should display loading spinner when loading is true', async () => {
    useMessages.mockReturnValueOnce({
      ...mockUseMessages,
      loading: true,
      messages: { results: [] }, // Simulate no messages when loading
    });

    render(
      <MemoryRouter>
        <Chats />
      </MemoryRouter>
    );

    // Use findByText to wait for the loading message to appear
    const loadingMessage = await screen.findByText(/Just a moment!/i);
    
    expect(loadingMessage).toBeInTheDocument();
  });
});
