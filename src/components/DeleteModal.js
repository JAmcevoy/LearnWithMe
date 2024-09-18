import React from 'react';

/**
 * DeleteModal component to confirm deletion of an item.
 */
const DeleteModal = ({ message = "Are you sure you want to delete this?", onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            {/* Modal container */}
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                {/* Modal title */}
                <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                
                {/* Modal message */}
                <p className="mb-4">{message}</p>
                
                {/* Modal action buttons */}
                <div className="flex justify-end space-x-4">
                    {/* Cancel button */}
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                        aria-label="Cancel deletion"
                    >
                        Cancel
                    </button>
                    
                    {/* Confirm button */}
                    <button
                        onClick={onConfirm}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        aria-label="Confirm deletion"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
