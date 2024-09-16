import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPaperPlane, FaEdit, FaTrash } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from '../../styles/Chats.module.css';
import DeleteConfirmation from '../../components/DeleteModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorModal from '../../components/ErrorModal';
import useMessages from '../../hooks/useMessages';

const Chats = () => {
  const { id } = useParams();
  const {
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
  } = useMessages(id);

  if (loading && !messages.results.length) return <LoadingSpinner />;

  const renderMessages = () =>
    [...messages.results]
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map((message) => (
        <div
          key={message.id}
          className={`bg-blue-300 p-4 rounded-lg shadow-md relative ${styles.chatbox}`}
        >
          <Link to={`/profile/${message.owner}`} className="font-semibold font-serif">
            {message.owner_username || 'Unknown User'}
          </Link>
          <p>{message.content}</p>
          <small>{message.created_at}</small>
          {message.owner === currentUser.pk && (
            <>
              <button
                className="absolute top-2 right-10 text-blue-500 hover:text-blue-700"
                onClick={() => setEditingMessageId(message.id)}
                aria-label="Edit message"
              >
                <FaEdit />
              </button>
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                onClick={() => handleDeleteClick(message)}
                aria-label="Delete message"
              >
                <FaTrash />
              </button>
            </>
          )}
        </div>
      ));

  return (
    <div className={`flex flex-col h-screen bg-slate-400 ${styles.fitting}`}>
      <header className="bg-slate-600 text-white p-4 shadow-md text-center">
        <h1 className="text-2xl font-sans capitalize">{circleName} chat</h1>
      </header>

      <div className="flex-grow p-4 overflow-auto scrollableDiv">
        <InfiniteScroll
          dataLength={messages.results.length}
          next={fetchMoreMessages(messages.useMessages)}
          hasMore={!!messages.next}
          loader={<p className="text-center mt-2">Loading more messages...</p>}
          scrollableTarget="scrollableDiv"
        >
          {renderMessages()}
        </InfiniteScroll>
        <div ref={messagesEndRef} />
      </div>

      <footer className="bg-slate-600 p-4 border-t border-black-200">
        <div className="flex items-center relative">
          <textarea
            className="flex-grow p-2 border border-gray-300 rounded-lg"
            value={newMessage}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            aria-label={editingMessageId ? 'Edit message' : 'New message'}
            placeholder={editingMessageId ? 'Edit your message...' : 'Type your message...'}
            rows={2}
          />
          <button
            onClick={handleSend}
            className={`ml-2 p-2 rounded-lg transition ${newMessage.trim() === ''
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            disabled={newMessage.trim() === ''}
            aria-disabled={newMessage.trim() === ''}
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

      {error && (
        <ErrorModal
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
};

export default Chats;
