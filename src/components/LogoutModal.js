import React from 'react';

function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null; // Don't render anything if the modal is closed

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Are you sure you want to log out?</h2>
        <div className="flex justify-center space-x-4">
        <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Yes, Log Out
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded text-black hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
