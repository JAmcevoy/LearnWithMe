import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import styles from "../styles/Chats.module.css";


const Chats = () => {
  const [messages] = useState([
    { id: 1, user: "Jane Doe", text: "Hello everyone!" },
    { id: 2, user: "John Smith", text: "Hi Jane!" },
    { id: 3, user: "Alice Johnson", text: "Welcome to the group!" },
  ]);
  const [newMessage] = useState("");

  return (
    <div className={`flex flex-col h-screen bg-gray-100 ${styles.fitting}`}>
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Chats</h1>
      </header>
      <div className="flex-grow p-4 overflow-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="bg-white p-4 rounded-lg shadow-md">
              <p className="font-semibold">{message.user}</p>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
      </div>
      <footer className="bg-white p-4 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-lg"
            value={newMessage}
            placeholder="Type your message..."
          />
          <button
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
