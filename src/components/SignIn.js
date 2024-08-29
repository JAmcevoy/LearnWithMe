import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useSetCurrentUser } from '../context/CurrentUserContext.js';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setCurrentUser } = useSetCurrentUser(); // Ensure this is a function
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const response = await axios.post('/dj-rest-auth/login/', {
        username,
        password,
      });

      const { data } = response;
      // Assuming data contains user information and possibly a token
      setCurrentUser(data); // Set current user context
      history.push('/'); // Redirect to home page or a relevant page
    } catch (err) {
      // Detailed error handling
      if (err.response) {
        // Server responded with a status other than 200 range
        setError(`Error: ${err.response.data.detail || 'Invalid credentials. Please try again.'}`);
      } else if (err.request) {
        // Request was made but no response received
        setError('Network error. Please try again.');
      } else {
        // Something happened in setting up the request
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Sign-in error:', err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-400">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
