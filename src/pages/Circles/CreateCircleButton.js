import React from 'react';
import { FaPlusCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CreateCircleButton = ({ onClick, onPrevClick, onNextClick, page, totalPages }) => (
  <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
    {/* Previous Button */}
    <button
      className="flex items-center p-2 rounded-full hover:bg-gray-300 focus:outline-none"
      onClick={onPrevClick}
      disabled={page === 1}
      style={{ opacity: page === 1 ? 0.5 : 1 }}
    >
      <FaChevronLeft className="h-6 w-6 text-gray-600" />
      <span className="ml-2 text-gray-600">Previous</span>
    </button>

    {/* Create Circle Button */}
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition flex items-center gap-2"
      aria-label="Create Circle"
    >
      <FaPlusCircle className="h-8 w-8" />
      <span className="text-lg font-semibold">Create Circle</span>
    </button>

    {/* Next Button */}
    <button
      className="flex items-center p-2 rounded-full hover:bg-gray-300 focus:outline-none"
      onClick={onNextClick}
      disabled={page === totalPages}
      style={{ opacity: page === totalPages ? 0.5 : 1 }} 
    >
      <span className="mr-2 text-gray-600">Next</span>
      <FaChevronRight className="h-6 w-6 text-gray-600" />
    </button>
  </div>
);

export default CreateCircleButton;
