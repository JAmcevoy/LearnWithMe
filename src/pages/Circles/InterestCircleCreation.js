import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../../components/ErrorModal';

const CreateCircle = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await axios.get('/categories/');
        if (response.data && Array.isArray(response.data.results)) {
          setCategories(response.data.results);
        } else {
          throw new Error('Unexpected data format');
        }
      } catch (err) {
        setError(`Error fetching categories: ${err.message}`);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('category', category);

      await axios.post('/interest-circles/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      history.push('/interest-circles');
    } catch (err) {
      setError(`Error creating interest circle: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseErrorModal = () => setError(null);

  return (
    <div className="p-6 lg:pr-20">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-700 leading-relaxed">
        Create Interest Circle
      </h1>

      {/* Error Modal */}
      {error && <ErrorModal message={error} onClose={handleCloseErrorModal} />}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Circle Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={submitting || loadingCategories || !name || !category}
            className={`bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition ${
              submitting || loadingCategories ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? 'Creating...' : 'Create Circle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCircle;
