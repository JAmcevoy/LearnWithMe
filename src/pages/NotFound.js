import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl font-semibold text-gray-600 mb-4">Oops! Page Not Found</p>
        <p className="text-gray-500 mb-8">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded hover:bg-blue-600 transition duration-300">
          Go to Home
        </Link>
      </div>
      <div className="absolute bottom-4 text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Your Company</p>
      </div>
    </div>
  );
};

export default NotFound;