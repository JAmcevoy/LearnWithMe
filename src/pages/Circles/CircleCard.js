import React, { useState } from "react";
import { FaInfoCircle, FaEdit, FaTrash } from "react-icons/fa";
import ErrorModal from "../../components/ErrorModal";

const CircleCard = ({ circle, onClick, onInfoClick, onEditClick, onDeleteClick }) => {
  const [error, setError] = useState(null);

 
  const handleDeleteClick = async (circleId) => {
    try {
      await onDeleteClick(circleId); 
    } catch (err) {
      setError("Error deleting the circle. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setError(null); 
  };

  return (
    <div className="relative flex items-center justify-center cursor-pointer" onClick={onClick}>
      
      {error && <ErrorModal message={error} onClose={handleCloseModal} />}
      
      <div className="relative bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex flex-col items-center justify-center w-44 h-44 text-center text-lg font-semibold text-white shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl">
        <div className="absolute inset-0 bg-black opacity-10 rounded-full"></div>
        <h2 className="relative z-10 text-xl font-sans">{circle.name}</h2>
        <p className="relative z-10 text-sm font-mono">{circle.owner}</p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onInfoClick();
          }}
          className="absolute top-2 left-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition"
        >
          <FaInfoCircle className="text-blue-500" />
        </button>

        {circle.is_owner && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditClick();
              }}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition"
            >
              <FaEdit className="text-green-500" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(circle.id);
              }}
              className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition"
            >
              <FaTrash className="text-red-500" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CircleCard;
