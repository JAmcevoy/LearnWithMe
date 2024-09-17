import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../../components/ErrorModal';
import LoadingSpinner from '../../components/LoadingSpinner';

const CreateCircle = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');  // General error message
  const [fieldErrors, setFieldErrors] = useState({});  // Field-specific errors
  const [loadingCategories, setLoadingCategories] = useState(false);  // Loading state for categories
  const [loading, setLoading] = useState(false);  // Form submission loading state
  const [showErrorModal, setShowErrorModal] = useState(false);  // Modal visibility
  const history = useHistory();

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      let allCategories = [];
      let page = 1;
      let hasMore = true;

      try {
        // Fetch paginated categories
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
        setShowErrorModal(true);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Client-side form validation
  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Circle name is required';
    if (!description.trim()) errors.description = 'Description is required';
    if (!category) errors.category = 'Please select a category';
    return errors;
  };

  // Handle form submission with validation and error handling
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setFieldErrors({});  // Clear any previous field errors
    setLoading(true);

    // Client-side validation before making API call
    const clientErrors = validateForm();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setLoading(false);
      return;
    }

    // Prepare form data for submission
    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('description', description.trim());
    formData.append('category', category);

    try {
      // Submit the form data
      await axios.post('/interest-circles/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      history.push('/interest-circles');  // Redirect after successful creation
    } catch (err) {
      if (err.response && err.response.data) {
        const serverErrors = err.response.data;

        // Handle field-specific errors returned by the server
        if (serverErrors.name) {
          setFieldErrors((prevErrors) => ({
            ...prevErrors,
            name: serverErrors.name[0],  // Assume the error is an array
          }));
        }
        if (serverErrors.description) {
          setFieldErrors((prevErrors) => ({
            ...prevErrors,
            description: serverErrors.description[0],
          }));
        }
        if (serverErrors.category) {
          setFieldErrors((prevErrors) => ({
            ...prevErrors,
            category: serverErrors.category[0],
          }));
        }

        // Handle general (non-field-specific) errors
        if (serverErrors.non_field_errors) {
          setError(serverErrors.non_field_errors[0]);
          setShowErrorModal(true);
        }
      } else {
        // Handle generic errors
        setError('Failed to create the interest circle. Please try again.');
        setShowErrorModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Render loading spinner while loading
  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-8 mt-16 md:mt-0">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-700 leading-relaxed">
        Create Interest Circle
      </h1>

      {/* Display error modal for general errors */}
      {showErrorModal && <ErrorModal message={error} onClose={() => setShowErrorModal(false)} />}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <FormInput
          id="name"
          label="Circle Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter the name of the circle"
          error={fieldErrors.name}  // Display field-specific error
        />

        <FormTextarea
          id="description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide a description for the circle"
          error={fieldErrors.description}  // Display field-specific error
        />

        <FormSelect
          id="category"
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categories}
          loadingCategories={loadingCategories}
          error={fieldErrors.category}  // Display field-specific error
        />

        <SubmitButton loading={loading} />
      </form>
    </div>
  );
};

// Reusable form components

const FormInput = ({ id, label, value, onChange, placeholder, error }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">
      {label}
    </label>
    <input
      id={id}
      type="text"
      value={value}
      onChange={onChange}
      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
        error ? 'border-red-500' : ''
      }`}
      placeholder={placeholder}
      required
    />
    {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
  </div>
);

const FormTextarea = ({ id, label, value, onChange, placeholder, error }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">
      {label}
    </label>
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
        error ? 'border-red-500' : ''
      }`}
      rows="4"
      placeholder={placeholder}
      required
    />
    {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
  </div>
);

const FormSelect = ({ id, label, value, onChange, options, loadingCategories, error }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
        error ? 'border-red-500' : ''
      }`}
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
    {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
  </div>
);

const SubmitButton = ({ loading }) => (
  <button
    type="submit"
    className="w-full bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition"
    disabled={loading}
  >
    {loading ? 'Creating...' : 'Create Circle'}
  </button>
);

export default CreateCircle;
