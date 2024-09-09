import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import ErrorModal from '../../components/ErrorModal';
import LoadingSpinner from '../../components/LoadingSpinner';

const PostCreation = () => {
    const [title, setTitle] = useState('');
    const [steps, setSteps] = useState('');
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const history = useHistory();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/categories/');
                console.log('Categories response:', response.data);

                if (response.data && Array.isArray(response.data.results)) {
                    setCategories(response.data.results);
                } else {
                    throw new Error('Data is not in expected format');
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError(`Error fetching categories: ${err.message}`);
                setShowErrorModal(true);
            }
        };

        fetchCategories();
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('steps', steps.trim());
        formData.append('category', selectedCategory);
        if (image) {
            formData.append('image_or_video', image);
        }

        try {
            const response = await axios.post('/posts/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            history.push(`/posts/${response.data.id}`);
        } catch (err) {
            console.error('Error creating post:', err);
            setError('Failed to create the post. Please try again.');
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
      }

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-400 p-4 md:p-8 mt-16 md:mt-0">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-900">Create a New Post</h2>
                    {error && <p className="text-red-500 mb-6">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-lg font-semibold text-gray-700">Title</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                                placeholder="Enter a catchy title for your post"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="steps" className="block text-lg font-semibold text-gray-700">Steps</label>
                            <textarea
                                id="steps"
                                value={steps}
                                onChange={(e) => setSteps(e.target.value)}
                                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                                rows="6"
                                placeholder="Share your Approach..."
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-lg font-semibold text-gray-700">Category</label>
                            <select
                                id="category"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                            >
                                <option value="">Select a category</option>
                                {categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.type}</option>
                                    ))
                                ) : (
                                    <option disabled>No categories available</option>
                                )}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                            disabled={loading}
                        >
                            {loading ? 'Creating Post...' : 'Create Post'}
                        </button>
                    </form>
                </div>
                <div className="flex-none w-full md:w-80 h-80 bg-gray-200 rounded-lg flex items-center justify-center relative">
                    {image ? (
                        <img
                            src={URL.createObjectURL(image)}
                            alt="Selected"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-500">
                            <FaUpload className="text-4xl mb-2" />
                            <p className="text-lg">Upload Image</p>
                        </div>
                    )}
                    <input
                        id="image"
                        type="file"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="posts/media/*"
                    />
                </div>
            </div>

            {/* Render Error Modal */}
            {showErrorModal && (
                <ErrorModal
                    message={error}
                    onClose={() => setShowErrorModal(false)}
                />
            )}
        </div>
    );
};

export default PostCreation;
