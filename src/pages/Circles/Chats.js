import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { FaPaperPlane, FaEdit } from "react-icons/fa";
import styles from "../../styles/Chats.module.css";
import { useCurrentUser } from "../../context/CurrentUserContext";

const Chats = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosReq.get(`/chats/circle/${id}/`);
        console.log("Fetched messages:", response.data);
        setMessages(response.data.results);
      } catch (err) {
        console.error("Error fetching messages:", err.response ? err.response.data : err.message);
        setError(`Error fetching messages: ${err.response ? err.response.data : err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [id]);

  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSend = async () => {
    if (editingMessageId) {
      await handleEditSubmit();
    } else {
      await handleNewMessageSubmit();
    }
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
        const updatedMessages = await axiosReq.get(`/chats/${id}/`);
        setMessages(updatedMessages.data.results);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      const errorMessage = err.response ? err.response.data : err.message;
      console.error("Error sending message:", errorMessage);
      setError(`Error sending message: ${errorMessage}`);
    }
  };

  const handleEditClick = (message) => {
    setNewMessage(message.content);
    setEditingMessageId(message.id);
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
        const updatedMessages = await axiosReq.get(`/chats/circle/${id}/`);
        setMessages(updatedMessages.data.results); 
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      const errorMessage = err.response ? err.response.data : err.message;
      console.error("Error editing message:", errorMessage);
      setError(`Error editing message: ${errorMessage}`);
    }
  };

  if (loading) {
    return <p className="text-center mt-8">Loading messages...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  return (
    <div className={`flex flex-col h-screen bg-gray-100 ${styles.fitting}`}>
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Chats</h1>
      </header>
      <div className="flex-grow p-4 overflow-auto">
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div key={message.id} className="bg-white p-4 rounded-lg shadow-md relative">
                <p className="font-semibold">{message.owner_username || "Unknown User"}</p>
                <p>{message.content || "No content"}</p>
                <p className="text-gray-500 text-sm">Sent at: {message.timestamp || "Unknown time"}</p>

                {currentUser && message.owner === currentUser.pk && (
                  <button
                    className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
                    onClick={() => handleEditClick(message)}
                  >
                    <FaEdit />
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center">No messages available</p>
          )}
        </div>
      </div>
      <footer className="bg-white p-4 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-lg"
            value={newMessage}
            onChange={handleChange}
            placeholder={editingMessageId ? "Edit your message..." : "Type your message..."}
          />
          <button
            onClick={handleSend}
            className="ml-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaPaperPlane />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chats;
