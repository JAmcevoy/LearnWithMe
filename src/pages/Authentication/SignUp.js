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

  const validateForm = () => {
    const { username, password, confirmPassword } = formData;

    if (!username.trim()) {
      return 'Username is required.';
    }

    if (username.length < 3) {
      return 'Username must be at least 3 characters long.';
    }

    if (!password) {
      return 'Password is required.';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsModalVisible(true);
      return;
    }

    const { username, password, confirmPassword } = formData;

    try {
      await axios.post('/dj-rest-auth/registration/', {
        username: username.trim(),
        password1: password,
        password2: confirmPassword,
      });

      history.push('/signin');
    } catch (err) {
      let errorMsg = 'An unexpected error occurred. Please try again.';

      if (err.response) {
        const { status, data } = err.response;

        if (status === 400) {
          if (data.username) {
            errorMsg = `Username: ${data.username[0]}`;
          } else if (data.password1) {
            errorMsg = `Password: ${data.password1[0]}`;
          } else {
            errorMsg = data.detail || 'Registration failed. Please check your details.';
          }
        } else if (status === 500) {
          errorMsg = 'Server error. Please try again later.';
        } else {
          errorMsg = `Error: ${data.detail || 'An error occurred.'}`;
        }
      } else if (err.request) {
        errorMsg = 'Network error. Please check your connection and try again.';
      }

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
