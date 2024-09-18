import { useState, useEffect, useRef } from 'react';
import { axiosReq } from '../api/axiosDefaults';
import { fetchMoreData } from '../utils/utils';
import { useCurrentUser } from '../context/CurrentUserContext';

const useMessages = (id) => {
  const currentUser = useCurrentUser();
  
  // State management for messages, new message input, and loading/errors
  const [messages, setMessages] = useState({ results: [], next: null });
  const [newMessage, setNewMessage] = useState(''); // Text input for new or edited messages
  const [editingMessageId, setEditingMessageId] = useState(null); // Tracks if a message is being edited
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // General error handling state
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Tracks whether delete modal is shown
  const [messageToDelete, setMessageToDelete] = useState(null); // Stores message to be deleted
  const [circleName, setCircleName] = useState(''); // Stores circle name for the chat
  const messagesEndRef = useRef(null); // Ref to scroll chat to bottom

  /**
   * Fetch initial messages when component mounts.
   * Fetches chat messages for the given circle ID.
   */
  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        const { data } = await axiosReq.get(`/chats/circle/${id}/`);
        setMessages({ results: data.results, next: data.next });
        setCircleName(data.results[0]?.chat_circle_name || 'No Circle Name');
      } catch (err) {
        handleError(`Error fetching messages: ${getErrorMessage(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialMessages();
  }, [id]);

  /**
   * Handles pre-filling message input if editing an existing message.
   */
  useEffect(() => {
    if (editingMessageId) {
      const messageToEdit = messages.results.find((msg) => msg.id === editingMessageId);
      if (messageToEdit) {
        setNewMessage(messageToEdit.content);
      }
    } else {
      setNewMessage(''); // Clear input when not editing
    }
  }, [editingMessageId, messages.results]);

  /**
   * Scrolls to the bottom of the chat whenever new messages are loaded.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.results]);

  /**
   * Fetch more messages when scrolling down.
   */
  const fetchMoreMessages = async () => {
    if (messages.next) {
      await fetchMoreData(messages, setMessages);
    }
  };

  /**
   * Helper function to get an error message from an error object.
   */
  const getErrorMessage = (err) => err.response?.data || err.message;

  /**
   * Handles error state and logging.
   */
  const handleError = (message) => {
    setError(message);
    console.error(message);
  };

  /**
   * Handles input changes for the message field.
   */
  const handleChange = (e) => setNewMessage(e.target.value);

  /**
   * Submits either a new message or an edited message.
   */
  const handleSend = async () => {
    if (newMessage.trim() === '') {
      handleError('Cannot send blank messages');
      return;
    }

    if (editingMessageId) {
      await handleEditSubmit();
    } else {
      await handleNewMessageSubmit();
    }
  };

  /**
   * Submits a new message to the API.
   */
  const handleNewMessageSubmit = async () => {
    try {
      const response = await axiosReq.post(`/chats/circle/${id}/`, {
        content: newMessage,
        circle: id,
        owner: currentUser.pk,
      });

      if (response.status === 201) {
        setNewMessage(''); // Clear input
        refreshMessages(); // Reload messages to reflect the new one
      }
    } catch (err) {
      handleError(`Error sending message: ${getErrorMessage(err)}`);
    }
  };

  /**
   * Submits an edited message to the API.
   */
  const handleEditSubmit = async () => {
    try {
      const response = await axiosReq.put(`/chats/${editingMessageId}/`, {
        content: newMessage,
        owner: currentUser.pk,
      });

      if (response.status === 200) {
        setNewMessage(''); // Clear input
        setEditingMessageId(null); // Reset editing state
        refreshMessages(); // Reload messages
      }
    } catch (err) {
      handleError(`Error editing message: ${getErrorMessage(err)}`);
    }
  };

  /**
   * Refreshes the list of messages from the API.
   */
  const refreshMessages = async () => {
    try {
      const { data } = await axiosReq.get(`/chats/circle/${id}/`);
      setMessages({ results: data.results, next: data.next });
    } catch (err) {
      handleError(`Error refreshing messages: ${getErrorMessage(err)}`);
    }
  };

  /**
   * Confirms deletion of a message.
   */
  const handleDeleteConfirm = async () => {
    try {
      const response = await axiosReq.delete(`/chats/${messageToDelete.id}/`);
      if (response.status === 204) {
        setMessages((prev) => ({
          ...prev,
          results: prev.results.filter((msg) => msg.id !== messageToDelete.id),
        }));
        setShowDeleteModal(false); // Close delete modal after successful deletion
      }
    } catch (err) {
      handleError(`Error deleting message: ${getErrorMessage(err)}`);
    }
  };

  /**
   * Opens the delete confirmation modal for a message.
   */
  const handleDeleteClick = (message) => {
    setMessageToDelete(message);
    setShowDeleteModal(true);
  };

  /**
   * Cancels the delete action and closes the modal.
   */
  const handleDeleteCancel = () => setShowDeleteModal(false);

  /**
   * Handles the "Enter" key press for sending or editing a message.
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default newline behavior
      handleSend();
    }
  };

  return {
    currentUser,
    messages,
    newMessage,
    editingMessageId,
    loading,
    error,
    showDeleteModal,
    circleName,
    messagesEndRef,
    handleChange,
    handleSend,
    handleDeleteClick,
    handleDeleteCancel,
    handleKeyPress,
    fetchMoreMessages,
    handleDeleteConfirm,
    setEditingMessageId,
    setError,
    setNewMessage,
  };
};

export default useMessages;
