import React from 'react';

/**
 * LoadingSpinner component that displays a spinning loader with a message.
 * Useful for indicating loading states in the application.
 */
const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen mt-2">
      {/* Spinning circle loader */}
      <div className="animate-spin rounded-full h-32 w-32 border-t-8 border-blue-500"></div>

      {/* Loading message */}
      <p className="text-center mt-4 text-xl font-semibold text-gray-800">
        <span className="text-blue-500">Just a moment!</span>
      </p>
    </div>
  );
};

export default LoadingSpinner;
