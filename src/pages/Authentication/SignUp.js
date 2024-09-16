import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../../components/ErrorModal';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const history = useHistory();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { username, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsModalVisible(true);
      return;
    }

    try {
      await axios.post('/dj-rest-auth/registration/', {
        username: username.trim(),
        password1: password,
        password2: confirmPassword,
      });

      history.push('/signin');
    } catch (err) {
      const errorMsg = err.response
        ? `Error: ${err.response.data.detail || 'An error occurred.'}`
        : err.request
        ? 'Network error. Please try again.'
        : 'An unexpected error occurred. Please try again.';
        
      setError(errorMsg);
      setIsModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-400">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            id="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
      </div>

      {isModalVisible && (
        <ErrorModal
          message={error}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

// Reusable input field component
const InputField = ({ id, label, type = 'text', value, onChange }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-gray-700 mb-2">{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded"
      required
    />
  </div>
);

export default SignUp;
