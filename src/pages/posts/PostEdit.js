import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import ErrorModal from '../../components/ErrorModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import Swal from 'sweetalert2'; 

const PostEdit = () => {
    const { id } = useParams(); // Extract post ID from URL params
    const history = useHistory(); // For navigation after form submission

    const [title, setTitle] = useState('');
    const [steps, setSteps] = useState('');
    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    // Fetch post details and available categories on component mount
    useEffect(() => {
        // Fetch post details
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

        // Fetch available categories for the dropdown
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const response = await axios.get('/categories/');
                if (response.data?.results && Array.isArray(response.data.results)) {
                    setCategories(response.data.results);
                } else {
                    throw new Error('Unexpected data format.');
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError(`Error fetching categories: ${err.message}`);
                setShowErrorModal(true);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchPostDetails();
        fetchCategories();
    }, [id]);

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setImage(file); // Store the selected image
    };

    // Handle form submission for updating the post
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors
        setLoading(true); // Set loading state during submission

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('steps', steps.trim());
        formData.append('category', selectedCategory);
        if (image) formData.append('image_or_video', image);

        try {
            await axios.put(`/posts/${id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            // Show success alert using SweetAlert2
            Swal.fire({
                icon: 'success',
                title: 'Post Updated',
                text: 'Your post has been updated successfully!',
                confirmButtonText: 'OK'
            }).then(() => {
                history.push(`/posts/${id}`); // Navigate to the updated post page after alert
            });
        } catch (err) {
            console.error('Error updating post:', err);
            // Show error alert using SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update the post. Please try again.',
                confirmButtonText: 'Retry'
            });
        } finally {
            setLoading(false); // Stop loading state
        }
    };

    // Show a loading spinner when the form is being submitted
    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-400 p-4 md:p-8 mt-16 md:mt-0">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-900">Edit Post</h2>
                    {error && <p className="text-red-500 mb-6">{error}</p>} {/* Show error message if any */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title Input */}
                        <FormInput
                            id="title"
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a catchy title for your post"
                        />
                        {/* Steps Input */}
                        <FormTextarea
                            id="steps"
                            label="Steps"
                            value={steps}
                            onChange={(e) => setSteps(e.target.value)}
                            placeholder="Share your thoughts or ideas..."
                        />
                        {/* Category Dropdown */}
                        <div className="mb-4">
                            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                                Category
                            </label>
                            <select
                                id="category"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-h-40 overflow-y-auto"
                                size="5"
                                required
                            >
                                <option value="">Select a category</option>
                                {loadingCategories ? (
                                    <option disabled>Loading categories...</option>
                                ) : categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.type}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No categories available</option>
                                )}
                            </select>
                        </div>
                        {/* Submit Button */}
                        <SubmitButton loading={loading} />
                    </form>
                </div>
                {/* Image Upload */}
                <ImageUpload
                    image={image}
                    existingImage={existingImage}
                    onImageChange={handleImageChange}
                />
            </div>
            {/* Error Modal */}
            {showErrorModal && (
                <ErrorModal message={error} onClose={() => setShowErrorModal(false)} />
            )}
        </div>
    );
};

// Reusable Form Input Component
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

// Reusable Textarea Component
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

// Reusable Submit Button Component
const SubmitButton = ({ loading }) => (
    <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        disabled={loading}
    >
        {loading ? 'Updating Post...' : 'Update Post'}
    </button>
);

// Reusable Image Upload Component
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
