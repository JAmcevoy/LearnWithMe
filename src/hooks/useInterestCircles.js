import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * Custom hook to manage interest circles.
 * Handles fetching, filtering, creating, editing, and deleting circles.
 */
const useInterestCircles = (history) => {
  // State management for circles, categories, loading states, and errors
  const [circles, setCircles] = useState({ results: [], next: null });
  const [filteredCircles, setFilteredCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ visible: false, type: '', circle: null });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [circleToDelete, setCircleToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Fetches the list of interest circles from the API.
   */
  const fetchCircles = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/interest-circles/');
      setCircles(data);
      setFilteredCircles(data.results); // Initialize filtered circles with all results
    } catch (err) {
      handleError('Error fetching interest circles', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches the list of categories from the API.
   */
  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await axios.get('/categories/');
      setCategories(data.results || []);
    } catch (err) {
      handleError('Error fetching categories', err);
    }
  }, []);

  // Fetch circles and categories on component mount
  useEffect(() => {
    fetchCircles();
    fetchCategories();
  }, [fetchCircles, fetchCategories]);

  /**
   * Filters the circles based on the search query.
   */
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = circles.results.filter((circle) =>
      circle.name.toLowerCase().includes(query)
    );
    setFilteredCircles(filtered);
  };

  /**
   * Clears the search filters and resets the filtered circles.
   */
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilteredCircles(circles.results);
  };

  /**
   * Handles error reporting and logging.
   */
  const handleError = (message, err) => {
    const errorMessage = `${message}: ${err.message}`;
    setError(errorMessage);
    console.error(errorMessage);
  };

  /**
   * Opens the modal for editing or viewing circle details.
   */
  const openModal = (type, circle = null) => setModal({ visible: true, type, circle });

  /**
   * Closes the currently open modal.
   */
  const closeModal = () => setModal({ visible: false, type: '', circle: null });

  /**
   * Saves changes to a circle.
   */
  const handleSaveChanges = async () => {
    if (!modal.circle) return;

    setSaveLoading(true);
    try {
      await axios.put(`/interest-circles/${modal.circle.id}/`, {
        name: modal.circle.name,
        description: modal.circle.description,
        category: selectedCategory,
      });
      await fetchCircles(); // Refresh circles after save
      closeModal();
    } catch (err) {
      handleSaveError(err);
    } finally {
      setSaveLoading(false);
    }
  };

  /**
   * Handles save-related errors.
   */
  const handleSaveError = (err) => {
    let message = 'Error saving changes';
    if (err.response?.status === 401) {
      message = 'Unauthorized. Please log in.';
    } else if (err.response?.status === 403) {
      message = "You don't have permission to edit this circle.";
    }
    handleError(message, err);
  };

  /**
   * Updates the modal fields for circle editing.
   */
  const handleModalChange = (field, value) => {
    setModal((prev) => ({
      ...prev,
      circle: { ...prev.circle, [field]: value },
    }));
  };

  /**
   * Prepares to delete a circle by opening the confirmation modal.
   */
  const handleDeleteClick = (circleId) => {
    setCircleToDelete(circleId);
    setDeleteModalVisible(true);
  };

  /**
   * Confirms and deletes the selected circle.
   */
  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`/interest-circles/${circleToDelete}/`);
      setCircles((prev) => ({
        ...prev,
        results: prev.results.filter((circle) => circle.id !== circleToDelete),
      }));
      setFilteredCircles((prev) =>
        prev.filter((circle) => circle.id !== circleToDelete)
      );
      setDeleteModalVisible(false);
      setCircleToDelete(null);
    } catch (err) {
      handleDeleteError(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * Handles errors during the delete process.
   */
  const handleDeleteError = (err) => {
    let message = 'Error deleting the circle.';
    if (err.response?.status === 401) {
      message = 'Unauthorized. Please log in.';
    } else if (err.response?.status === 403) {
      message = "You don't have permission to delete this circle.";
    } else if (err.response?.status === 404) {
      message = 'Circle not found.';
    }
    handleError(message, err);
  };

  /**
   * Cancels the delete action.
   */
  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setCircleToDelete(null);
  };

  /**
   * Navigates to the chat page for a circle.
   */
  const handleCircleClick = (id) => history.push(`/interest-circles/${id}/chats`);

  /**
   * Navigates to the page for creating a new circle.
   */
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
