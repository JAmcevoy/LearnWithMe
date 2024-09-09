import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen mt-2">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
      <p className="text-center mt-4 text-xl font-semibold text-gray-800">
        <span className="text-blue-500">Just a moment,</span> we’re fetching the latest data for you!
      </p>
    </div>
  );
};

export default LoadingSpinner;
