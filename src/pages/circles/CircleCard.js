import React, { useState } from 'react';
import { FaInfoCircle, FaEdit, FaTrash } from 'react-icons/fa';
import ErrorModal from '../../components/ErrorModal';


const CircleCard = ({ circle, onClick, onInfoClick, onEditClick, onDeleteClick }) => {
  const [error, setError] = useState(null); // State to track any deletion errors

  // Handles delete click and catches errors
  const handleDeleteClick = async (circleId) => {
    try {
      await onDeleteClick(circleId); // Trigger the delete function passed as a prop
    } catch {
      setError('Error deleting the circle. Please try again.'); // Set error if delete fails
    }
  };

  // Closes the error modal
  const handleCloseModal = () => setError(null);

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer"
      onClick={onClick} // Trigger the general click event when the card is clicked
    >
      {/* Display error modal if deletion fails */}
      {error && <ErrorModal message={error} onClose={handleCloseModal} />}

      {/* Circle card UI */}
      <div className="relative bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex flex-col items-center justify-center w-44 h-44 text-center text-lg font-semibold text-white shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl">
        {/* Overlay background effect */}
        <div className="absolute inset-0 bg-black opacity-10 rounded-full"></div>
        
        {/* Circle details (name and owner) */}
        <h2 className="relative z-10 text-xl font-sans">{circle.name}</h2>
        <p className="relative z-10 text-sm font-mono">{circle.owner}</p>

        {/* Info button */}
        <Button
          onClick={(e) => {
            e.stopPropagation(); // Prevent parent click event
            onInfoClick(); // Trigger the info click function
          }}
          className="absolute top-2 left-2"
          icon={<FaInfoCircle className="text-blue-500" />}
        />

        {/* Edit and Delete buttons only if the user is the owner */}
        {circle.is_owner && (
          <>
            {/* Edit button */}
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent click event
                onEditClick(); // Trigger the edit click function
              }}
              className="absolute top-2 right-2"
              icon={<FaEdit className="text-green-500" />}
            />

            {/* Delete button */}
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent click event
                handleDeleteClick(circle.id); // Handle delete with error handling
              }}
              className="absolute bottom-2 right-2"
              icon={<FaTrash className="text-red-500" />}
            />
          </>
        )}
      </div>
    </div>
  );
};


const Button = ({ onClick, className, icon }) => (
  <button
    onClick={onClick}
    className={`bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition ${className}`}
  >
    {icon}
  </button>
);

export default CircleCard;
