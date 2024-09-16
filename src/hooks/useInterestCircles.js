import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useInterestCircles = (history) => {
  // State Hooks
  const [circles, setCircles] = useState({ results: [], next: null }); // Correct initialization
  const [filteredCircles, setFilteredCircles] = useState([]); // Add filteredCircles state
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({
    visible: false,
    type: '',
    circle: null,
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [circleToDelete, setCircleToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Search query state

  // Fetch Functions
  const fetchCircles = useCallback(async () => {
    try {
      const { data } = await axios.get('/interest-circles/');
      setCircles(data);
      setFilteredCircles(data.results); // Initially set filteredCircles as all circles
    } catch (err) {
      handleError('Error fetching interest circles', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await axios.get('/categories/');
      setCategories(data.results || []);
    } catch (err) {
      handleError('Error fetching categories', err);
    }
  }, []);

  useEffect(() => {
    fetchCircles();
    fetchCategories();
  }, [fetchCircles, fetchCategories]);

  // Handle Search and Filters
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter circles based on the search query
    const filtered = circles.results.filter((circle) =>
      circle.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCircles(filtered);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilteredCircles(circles.results); // Reset the filtered list
  };

  // Error Handling
  const handleError = (message, err) => {
    setError(`${message}: ${err.message}`);
    console.error(message, err);
  };

  // Modal Handlers
  const openModal = (type, circle = null) => setModal({ visible: true, type, circle });
  const closeModal = () => setModal({ visible: false, type: '', circle: null });

  // Save Changes
  const handleSaveChanges = async () => {
    if (!modal.circle) return;

    try {
      setSaveLoading(true);
      await axios.put(`/interest-circles/${modal.circle.id}/`, {
        name: modal.circle.name,
        description: modal.circle.description,
        category: selectedCategory,
      });
      await fetchCircles();
      closeModal();
    } catch (err) {
      handleSaveError(err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveError = (err) => {
    let message = 'Error saving changes';
    if (err.response?.status === 401) {
      message = "Unauthorized. Please log in.";
    } else if (err.response?.status === 403) {
      message = "Forbidden. You don't have permission to edit this circle.";
    }
    handleError(message, err);
  };

  const handleModalChange = (field, value) => {
    setModal((prevModal) => ({
      ...prevModal,
      circle: {
        ...prevModal.circle,
        [field]: value,
      },
    }));
  };

  // Delete Circle
  const handleDeleteClick = (circleId) => {
    setCircleToDelete(circleId);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await axios.delete(`/interest-circles/${circleToDelete}/`);
      setCircles((prevCircles) => ({
        ...prevCircles,
        results: prevCircles.results.filter((circle) => circle.id !== circleToDelete),
      }));
      setFilteredCircles((prevFilteredCircles) =>
        prevFilteredCircles.filter((circle) => circle.id !== circleToDelete)
      );
      setDeleteModalVisible(false);
      setCircleToDelete(null);
    } catch (err) {
      handleDeleteError(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setCircleToDelete(null);
  };

  const handleDeleteError = (err) => {
    let message = 'Error deleting the circle.';
    if (err.response?.status === 401) {
      message = "Unauthorized. Please log in.";
    } else if (err.response?.status === 403) {
      message = "Forbidden. You don't have permission to delete this circle.";
    } else if (err.response?.status === 404) {
      message = "Circle not found.";
    }
    handleError(message, err);
  };

  // Event Handlers
  const handleCircleClick = (id) => history.push(`/interest-circles/${id}/chats`);
  const handleCreateCircle = () => history.push('/interest-circles/create');

  return {
    circles,
    filteredCircles,
    loading,
    saveLoading,
    deleteLoading,
    error,
    modal,
    categories,
    selectedCategory,
    deleteModalVisible,
    circleToDelete,
    searchQuery,
    handleCircleClick,
    handleCreateCircle,
    handleInfoClick: (circle) => openModal('info', circle),
    handleEditClick: (circle) => {
      setSelectedCategory(circle.category || '');
      openModal('edit', circle);
    },
    handleCloseModal: closeModal,
    handleSaveChanges,
    handleModalChange,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    handleSearchChange,
    handleClearFilters,
    setSelectedCategory,
    setError,
    setCircles,
  };
};

export default useInterestCircles;
