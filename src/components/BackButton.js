import React from 'react';
import { useHistory } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import styles from '../styles/BackButton.module.css';

const BackButton = () => {
  const history = useHistory();

  const handleBack = () => {
    history.goBack();
  };

  return (
    <button
      onClick={handleBack}
      className={`${styles.backbtn} fixed top-4 left-4 p-2 bg-blue-600 text-white 
        rounded-full shadow-lg z-50 flex items-center justify-center bg-gray-800`}
      aria-label="Go back"
    >
      <FaArrowLeft size={25} />
      <span className="ml-2">Back</span>
    </button>
  );
};

export default BackButton;
