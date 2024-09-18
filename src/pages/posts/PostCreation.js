import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import ErrorModal from '../../components/ErrorModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import Swal from 'sweetalert2';

const PostCreation = () => {
  const [title, setTitle] = useState('');
  const [steps, setSteps] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const history = useHistory();

  // Fetch categories with pagination handling
  useEffect(() => {
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
            hasMore = !!response.data.next;
            page += 1;
          } else {
            throw new Error('Unexpected data format');
          }
        }
        setCategories(allCategories);
      } catch (err) {
        setError(`Error fetching categories: ${err.message}`);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle image change and update preview
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Handle form submission
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
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // Show success message with SweetAlert
      Swal.fire({
        title: 'Post Created!',
        text: 'Your post has been successfully created.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        history.push(`/posts/${response.data.id}`); // Redirect after creation
      });
  
    } catch (err) {
      console.error('Error creating post:', err);
      
      // Show error message with SweetAlert
      Swal.fire({
        title: 'Error!',
        text: 'Failed to create the post. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
  
      setError('Failed to create the post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-400 p-4 md:p-8 mt-16 md:mt-0">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-900">Create a New Post</h2>
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
              placeholder="Share your approach..."
            />
            <FormSelect
              id="category"
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={categories}
              loadingCategories={loadingCategories}
              error={error}
            />
            <SubmitButton loading={loading} />
          </form>
        </div>
        <ImageUpload image={image} onImageChange={handleImageChange} />
      </div>

      {/* Render Error Modal */}
      {showErrorModal && (
        <ErrorModal message={error} onClose={() => setShowErrorModal(false)} />
      )}
    </div>
  );
};

// Reusable form components

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

const FormSelect = ({ id, label, value, onChange, options, loadingCategories, error }) => (
  <div>
    <label htmlFor={id} className="block text-lg font-semibold text-gray-700">{label}</label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-h-40 overflow-y-auto"
      size="5"
      required
    >
      <option value="">Select a category</option>
      {loadingCategories ? (
        <option disabled>Loading categories...</option>
      ) : options.length > 0 ? (
        options.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.type}
          </option>
        ))
      ) : (
        <option disabled>No categories available</option>
      )}
    </select>
    {error && <p className="text-red-500 mt-2">{error}</p>}
  </div>
);

const SubmitButton = ({ loading }) => (
  <button
    type="submit"
    className="w-full bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
    disabled={loading}
  >
    {loading ? 'Creating Post...' : 'Create Post'}
  </button>
);

const ImageUpload = ({ image, onImageChange }) => (
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
      onChange={onImageChange}
      className="absolute inset-0 opacity-0 cursor-pointer"
      accept="image/*"
    />
  </div>
);

export default PostCreation;
