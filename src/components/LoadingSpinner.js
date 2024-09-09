import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen mt-2">
      <div className="animate-spin rounded-full h-32 w-32 border-t-8 border-blue-500"></div>
      <p className="text-center mt-4 text-xl font-semibold text-gray-800">
        <span className="text-black-500">
          Just a moment!
        </span>
      </p>
    </div>
  );
};

export default LoadingSpinner;
