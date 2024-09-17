import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import ErrorModal from '../../components/ErrorModal';
import LoadingSpinner from '../../components/LoadingSpinner';

const PostEdit = () => {
    const { id } = useParams();
    const history = useHistory();

    const [title, setTitle] = useState('');
    const [steps, setSteps] = useState('');
    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await axios.get(`/posts/${id}/`);
                const post = response.data;
                setTitle(post.title);
                setSteps(post.steps);
                setSelectedCategory(post.category);
                setExistingImage(post.image_or_video);
            } catch (err) {
                console.error('Error fetching post details:', err);
                setError('Error fetching post details.');
                setShowErrorModal(true);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('/categories/');
                if (response.data?.results && Array.isArray(response.data.results)) {
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

        fetchPostDetails();
        fetchCategories();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('steps', steps.trim());
        formData.append('category', selectedCategory);
        if (image) formData.append('image_or_video', image);

        try {
            await axios.put(`/posts/${id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            history.push(`/posts/${id}`);
        } catch (err) {
            console.error('Error updating post:', err);
            setError('Failed to update the post. Please try again.');
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-400 p-4 md:p-8 mt-16 md:mt-0">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-900">Edit Post</h2>
                    {error && <p className="text-red-500 mb-6">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormInput
                            id="title"
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a catchy title for your post"
                        />
                        <FormTextarea
                            id="steps"
                            label="Steps"
                            value={steps}
                            onChange={(e) => setSteps(e.target.value)}
                            placeholder="Share your thoughts or ideas..."
                        />
                        <FormSelect
                            id="category"
                            label="Category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            options={categories}
                        />
                        <SubmitButton loading={loading} />
                    </form>
                </div>
                <ImageUpload
                    image={image}
                    existingImage={existingImage}
                    onImageChange={handleImageChange}
                />
            </div>
            {showErrorModal && (
                <ErrorModal message={error} onClose={() => setShowErrorModal(false)} />
            )}
        </div>
    );
};

// Reusable Form Components

const FormInput = ({ id, label, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-lg font-semibold text-gray-700">{label}</label>
        <input
            id={id}
            type="text"
            value={value}
            onChange={onChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            placeholder={placeholder}
            required
        />
    </div>
);

const FormTextarea = ({ id, label, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-lg font-semibold text-gray-700">{label}</label>
        <textarea
            id={id}
            value={value}
            onChange={onChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            rows="6"
            placeholder={placeholder}
            required
        />
    </div>
);

const FormSelect = ({ id, label, value, onChange, options }) => (
    <div>
        <label htmlFor={id} className="block text-lg font-semibold text-gray-700">{label}</label>
        <select
            id={id}
            value={value}
            onChange={onChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            required
        >
            <option value="">Select a category</option>
            {options.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.type}</option>
            ))}
        </select>
    </div>
);

const SubmitButton = ({ loading }) => (
    <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        disabled={loading}
    >
        {loading ? 'Updating Post...' : 'Update Post'}
    </button>
);

const ImageUpload = ({ image, existingImage, onImageChange }) => (
    <div className="flex-none w-full md:w-80 h-80 bg-gray-200 rounded-lg flex items-center justify-center relative">
        {image ? (
            <img
                src={URL.createObjectURL(image)}
                alt="Selected"
                className="w-full h-full object-cover rounded-lg"
            />
        ) : (
            existingImage ? (
                <img
                    src={existingImage}
                    alt="Current"
                    className="w-full h-full object-cover rounded-lg"
                />
            ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                    <FaUpload className="text-4xl mb-2" />
                    <p className="text-lg">Upload Image</p>
                </div>
            )
        )}
        <input
            id="image"
            type="file"
            onChange={onImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="image/*"
        />
    </div>
);

export default PostEdit;
