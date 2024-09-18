import React from 'react';

/**
 * ErrorModal component to display error messages in a modal dialog.
 */
const ErrorModal = ({ message = "An unexpected error occurred.", onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      {/* Modal content container */}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        {/* Error title */}
        <h2 className="text-xl font-bold mb-4 text-red-600">Error</h2>
        
        {/* Error message */}
        <p className="mb-4 text-gray-800">{message}</p>
        
        {/* Close button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            aria-label="Close error modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
