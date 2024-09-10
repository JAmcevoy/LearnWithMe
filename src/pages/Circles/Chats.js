import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { FaPaperPlane, FaEdit, FaTrash } from "react-icons/fa";
import styles from "../../styles/Chats.module.css";
import { useCurrentUser } from "../../context/CurrentUserContext";
import DeleteConfirmation from "../../components/DeleteModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorModal from "../../components/ErrorModal";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Chats = () => {
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [circleName, setCircleName] = useState("");

  // Fetch messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axiosReq.get(`/chats/circle/${id}/`);
        if (data?.results?.length) {
          setMessages(data.results);
          setCircleName(data.results[0].chat_circle_name || "No Circle Name");
        } else {
          setCircleName("No Circle Name");
        }
      } catch (err) {
        handleError(`Error fetching messages: ${getErrorMessage(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [id]);

  // Helper to extract error message
  const getErrorMessage = (err) => err.response?.data || err.message;

  // Handle error and show modal
  const handleError = (message) => setError(message);

  // Handle new message input
  const handleChange = (e) => setNewMessage(e.target.value);

  // Handle sending a new or edited message
  const handleSend = async () => {
    if (newMessage.trim() === "") {
      handleError("Cannot send blank messages");
      return;
    }

    editingMessageId ? await handleEditSubmit() : await handleNewMessageSubmit();
  };

  // Submit new message
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

  // Submit edited message
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

  // Refresh messages after changes
  const refreshMessages = async () => {
    try {
      const { data } = await axiosReq.get(`/chats/circle/${id}/`);
      setMessages(data.results);
    } catch (err) {
      handleError(`Error refreshing messages: ${getErrorMessage(err)}`);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      const response = await axiosReq.delete(`/chats/${messageToDelete.id}/`);
      if (response.status === 204) {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageToDelete.id));
        setShowDeleteModal(false);
      }
    } catch (err) {
      handleError(`Error deleting message: ${getErrorMessage(err)}`);
    }
  };

  // Open delete confirmation modal
  const handleDeleteClick = (message) => {
    setMessageToDelete(message);
    setShowDeleteModal(true);
  };

  // Cancel deletion
  const handleDeleteCancel = () => setShowDeleteModal(false);

  // Handle key press for 'Enter' to send and 'Shift + Enter' for newline
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Display loading spinner while fetching data
  if (loading) return <LoadingSpinner />;

  return (
    <div className={`flex flex-col h-screen bg-gray-100 ${styles.fitting}`}>
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">{circleName} Chats</h1>
      </header>

      <div className="flex-grow p-4 overflow-auto">
        <div className="space-y-4">
          {messages.length ? (
            messages.map((message) => (
              <div key={message.id} className="bg-white p-4 rounded-lg shadow-md relative">
                <Link to={`/profile/${message.owner}`} className="font-semibold">{message.owner_username || "Unknown User"}</Link>
                <p>{message.content || "No content"}</p>
                <p className="text-gray-500 text-sm">{message.timestamp || "Unknown time"}</p>

                {message.owner === currentUser.pk && (
                  <>
                    <button
                      className="absolute top-2 right-10 text-blue-500 hover:text-blue-700"
                      onClick={() => handleEditClick(message)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteClick(message)}
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-center">No messages available</p>
          )}
        </div>
      </div>

      <footer className="bg-white p-4 border-t border-gray-200">
        <div className="flex items-center relative">
          <textarea
            className="flex-grow p-2 border border-gray-300 rounded-lg"
            value={newMessage}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            aria-label={editingMessageId ? "Edit message" : "New message"}
            placeholder={editingMessageId ? "Edit your message..." : "Type your message..."}
            rows={2}
          />
          <button
            onClick={handleSend}
            className={`ml-2 p-2 rounded-lg transition ${
              newMessage.trim() === ""
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={newMessage.trim() === ""}
            aria-disabled={newMessage.trim() === ""}
            aria-label="Send message"
          >
            <FaPaperPlane />
          </button>
        </div>
      </footer>

      {showDeleteModal && (
        <DeleteConfirmation
          message="Are you sure you want to delete this message?"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
    </div>
  );
};

export default Chats;