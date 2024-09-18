import React from 'react';
import { useHistory } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import styles from '../styles/BackButton.module.css';

/**
 * BackButton component allows users to navigate back to the previous page.
 */
const BackButton = () => {
  const history = useHistory();

  // Handles the back navigation
  const handleBack = () => {
    history.goBack();
  };

  return (
    <button
      onClick={handleBack}
      className={`${styles.backbtn} fixed top-3 left-4 p-2 bg-gray-800 text-white 
        rounded-full shadow-lg z-50 flex items-center justify-center`}
      aria-label="Go back"
    >
      {/* Icon representing back action */}
      <FaArrowLeft size={25} />
      {/* Text label for the back button */}
      <span className="ml-2">Back</span>
    </button>
  );
};

export default BackButton;
