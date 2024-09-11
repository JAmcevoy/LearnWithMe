import { useState, useEffect, useRef } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { fetchMoreData } from "../utils/utils";
import { useCurrentUser } from "../context/CurrentUserContext";

const useMessages = (id) => {
  const currentUser = useCurrentUser(); 
  const [messages, setMessages] = useState({ results: [], next: null });
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [circleName, setCircleName] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        const { data } = await axiosReq.get(`/chats/circle/${id}/`);
        setMessages({ results: data.results, next: data.next });
        setCircleName(data.results[0]?.chat_circle_name || "No Circle Name");
      } catch (err) {
        handleError(`Error fetching messages: ${getErrorMessage(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialMessages();
  }, [id]);

  useEffect(() => {
    if (editingMessageId) {
      const messageToEdit = messages.results.find(
        (msg) => msg.id === editingMessageId
      );
      if (messageToEdit) {
        setNewMessage(messageToEdit.content);
      }
    } else {
      setNewMessage("");
    }
  }, [editingMessageId, messages.results]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.results]);

  const fetchMoreMessages = async () => {
    if (messages.next) {
      await fetchMoreData(messages, setMessages);
    }
  };

  const getErrorMessage = (err) => err.response?.data || err.message;
  const handleError = (message) => setError(message);

  const handleChange = (e) => setNewMessage(e.target.value);

  const handleSend = async () => {
    if (newMessage.trim() === "") {
      handleError("Cannot send blank messages");
      return;
    }

    editingMessageId
      ? await handleEditSubmit()
      : await handleNewMessageSubmit();
  };

  const handleNewMessageSubmit = async () => {
    try {
      const response = await axiosReq.post(`/chats/circle/${id}/`, {
        content: newMessage,
        circle: id,
        owner: currentUser.pk,
      });

      if (response.status === 201) {
        setNewMessage("");
        refreshMessages();
      }
    } catch (err) {
      handleError(`Error sending message: ${getErrorMessage(err)}`);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axiosReq.put(`/chats/${editingMessageId}/`, {
        content: newMessage,
        owner: currentUser.pk,
      });

      if (response.status === 200) {
        setNewMessage("");
        setEditingMessageId(null);
        refreshMessages();
      }
    } catch (err) {
      handleError(`Error editing message: ${getErrorMessage(err)}`);
    }
  };

  const refreshMessages = async () => {
    try {
      const { data } = await axiosReq.get(`/chats/circle/${id}/`);
      setMessages({ results: data.results, next: data.next });
    } catch (err) {
      handleError(`Error refreshing messages: ${getErrorMessage(err)}`);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axiosReq.delete(`/chats/${messageToDelete.id}/`);
      if (response.status === 204) {
        setMessages((prev) => ({
          ...prev,
          results: prev.results.filter(
            (msg) => msg.id !== messageToDelete.id
          ),
        }));
        setShowDeleteModal(false);
      }
    } catch (err) {
      handleError(`Error deleting message: ${getErrorMessage(err)}`);
    }
  };

  const handleDeleteClick = (message) => {
    setMessageToDelete(message);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => setShowDeleteModal(false);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
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
  };
};

export default useMessages;
