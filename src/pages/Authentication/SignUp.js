import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../../components/ErrorModal'; 

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false); 
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setIsModalVisible(true); 
            return;
        }

        try {
            await axios.post('/dj-rest-auth/registration/', {
                username: username.trim(),
                password1: password,
                password2: confirmPassword
            });

            history.push('/signin');
        } catch (err) {
            if (err.response) {
                setError(`Error: ${JSON.stringify(err.response.data)}`);
            } else if (err.request) {
                setError('Network error. Please try again.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
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
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Sign Up
                    </button>
                </form>
            </div>

            {/* Render ErrorModal if there's an error */}
            {isModalVisible && (
                <ErrorModal
                    message={error}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default SignUp;
