import React from "react";
import { FaPlusCircle } from "react-icons/fa";

const CreateCircleButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-indigo-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition flex items-center gap-2"
  >
    <FaPlusCircle className="h-8 w-8" />
    <span className="text-lg font-semibold">Create Circle</span>
  </button>
);

export default CreateCircleButton;
