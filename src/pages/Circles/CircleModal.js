import React, { useState } from 'react';
import ErrorModal from '../../components/ErrorModal';

const Modal = ({
  type,
  circle,
  categories,
  selectedCategory,
  onClose,
  onSave,
  onCategoryChange,
  onModalChange,
}) => {
  const [error, setError] = useState(null); // State to track any save errors

  // Handle save with error catching
  const handleSave = async () => {
    try {
      await onSave();
    } catch (err) {
      setError('An error occurred while saving the circle. Please try again.');
    }
  };

  // Handle closing error modal
  const handleCloseErrorModal = () => setError(null);

  // Renders content for viewing circle info
  const renderInfoContent = () => (
    <>
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Description:</h3>
      <p className="mb-4 text-gray-600">{circle.description || 'No description available'}</p>
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Category:</h3>
      <p className="mb-4 text-gray-600">{circle.category_name || 'No category available'}</p>
      <button
        onClick={onClose}
        className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition"
      >
        Close
      </button>
    </>
  );

  // Renders content for editing circle details
  const renderEditContent = () => (
    <>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Circle</h2>
      <input
        type="text"
        value={circle.name}
        onChange={(e) => onModalChange('name', e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
        placeholder="Circle Name"
      />
      <textarea
        value={circle.description}
        onChange={(e) => onModalChange('description', e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
        placeholder="Circle Description"
      />
      <select
        id="category"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
      >
        <option value="">Select a category</option>
        {categories.length > 0 ? (
          categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.type}
            </option>
          ))
        ) : (
          <option disabled>No categories available</option>
        )}
      </select>
      <div className="flex justify-end gap-2">
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-600 transition"
        >
          Cancel
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Error Modal for any save errors */}
      {error && <ErrorModal message={error} onClose={handleCloseErrorModal} />}

      {/* Modal structure */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-80 lg:w-1/3">
          {type === 'info' ? renderInfoContent() : renderEditContent()}
        </div>
      </div>
    </>
  );
};

export default Modal;