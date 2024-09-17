import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';

const ProfileEdit = () => {
    const [username, setUsername] = useState('');
    const [aboutMe, setAboutMe] = useState('');
    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [error, setError] = useState('');
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const { id } = useParams();

    // Fetch profile details and categories when component mounts
    useEffect(() => {
        // Fetch profile details
        const fetchProfileDetails = async () => {
            try {
                const { data } = await axios.get(`/profiles/${id}/`);
                setUsername(data.username);
                setAboutMe(data.about_me);
                setSelectedCategory(data.main_interest);
                setExistingImage(data.image);
            } catch (err) {
                console.error('Error fetching profile details:', err);
                setError('Unable to load profile details. Please try again.');
            }
        };

        // Fetch categories with pagination handling
        const fetchCategories = async () => {
            setLoadingCategories(true);
            let allCategories = [];
            let page = 1;
            let hasMore = true;

            try {
                while (hasMore) {
                    const response = await axios.get(`/categories/?page=${page}`);
                    if (response.data && Array.isArray(response.data.results)) {
                        allCategories = [...allCategories, ...response.data.results];
                        hasMore = !!response.data.next; // Continue if there are more pages
                        page += 1;
                    } else {
                        throw new Error('Unexpected data format while fetching categories.');
                    }
                }
                setCategories(allCategories);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories. Please try again.');
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchProfileDetails();
        fetchCategories();
    }, [id]);

    // Handle image selection
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]); // Store selected image in state
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors
        setLoading(true); // Set loading state

        const formData = new FormData();
        formData.append('username', username.trim());
        formData.append('about_me', aboutMe.trim());
        formData.append('main_interest', selectedCategory);
        if (image) {
            formData.append('image', image); // Append image if selected
        }

        try {
            await axios.put(`/profiles/${id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            history.push(`/profile/${id}`); // Redirect to profile page after successful update
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update the profile. Please check your details and try again.');
        } finally {
            setLoading(false);
        }
    };

    // Show loading spinner while data is being fetched or form is being submitted
    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-400 p-4 md:p-8 mt-16 md:mt-0">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-900">Edit Profile</h2>
                    {error && <p className="text-red-500 mb-6">{error}</p>} {/* Show error message if any */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username input */}
                        <div>
                            <label htmlFor="username" className="block text-lg font-semibold text-gray-700">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        {/* About Me input */}
                        <div>
                            <label htmlFor="aboutMe" className="block text-lg font-semibold text-gray-700">About Me</label>
                            <textarea
                                id="aboutMe"
                                value={aboutMe}
                                onChange={(e) => setAboutMe(e.target.value)}
                                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                                rows="6"
                                placeholder="Tell us something about yourself..."
                                required
                            />
                        </div>

                        {/* Category selection */}
                        <div>
                            <label htmlFor="category" className="block text-lg font-semibold text-gray-700">Main Interest</label>
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

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                            disabled={loading}
                        >
                            {loading ? 'Updating Profile...' : 'Update Profile'}
                        </button>
                    </form>
                </div>

                {/* Image upload */}
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
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/*"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfileEdit;
