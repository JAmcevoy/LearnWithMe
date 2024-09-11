import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useInterestCircles = (history) => {
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({
    visible: false,
    type: "",
    circle: null,
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [circleToDelete, setCircleToDelete] = useState(null);

  const fetchCircles = useCallback(async () => {
    try {
      const { data } = await axios.get("/interest-circles/");
      setCircles(data.results || data);
    } catch (err) {
      handleError("Error fetching interest circles", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await axios.get("/categories/");
      setCategories(data.results || []);
    } catch (err) {
      handleError("Error fetching categories", err);
    }
  }, []);

  useEffect(() => {
    fetchCircles();
    fetchCategories();
  }, [fetchCircles, fetchCategories]);

  const handleError = (message, err) => {
    setError(`${message}: ${err.message}`);
    console.error(message, err);
  };

  const handleCircleClick = (id) => history.push(`/interest-circles/${id}/chats`);
  const handleCreateCircle = () => history.push('/interest-circles/create');

  const handleInfoClick = (circle) => setModal({
    visible: true,
    type: "info",
    circle,
  });

  const handleEditClick = (circle) => {
    setSelectedCategory(circle.category || "");
    setModal({
      visible: true,
      type: "edit",
      circle,
    });
  };

  const handleCloseModal = () => setModal({
    visible: false,
    type: "",
    circle: null,
  });

  const handleSaveChanges = async () => {
    if (!modal.circle) return;

    try {
      setSaveLoading(true);
      await axios.put(`/interest-circles/${modal.circle.id}/`, {
        name: modal.circle.name,
        description: modal.circle.description,
        category: selectedCategory,
      });
      await fetchCircles(); // Ensure fetchCircles is available
      handleCloseModal();
    } catch (err) {
      handleSaveError(err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveError = (err) => {
    let message = "Error saving changes";
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

  const handleDeleteClick = (circleId) => {
    setCircleToDelete(circleId);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await axios.delete(`/interest-circles/${circleToDelete}/`);
      setCircles((prevCircles) => prevCircles.filter((circle) => circle.id !== circleToDelete));
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
    let message = "Error deleting the circle.";
    if (err.response?.status === 401) {
      message = "Unauthorized. Please log in.";
    } else if (err.response?.status === 403) {
      message = "Forbidden. You don't have permission to delete this circle.";
    } else if (err.response?.status === 404) {
      message = "Circle not found.";
    }
    handleError(message, err);
  };

  return {
    circles,
    loading,
    saveLoading,
    deleteLoading,
    error,
    modal,
    categories,
    selectedCategory,
    deleteModalVisible,
    circleToDelete,
    handleCircleClick,
    handleCreateCircle,
    handleInfoClick,
    handleEditClick,
    handleCloseModal,
    handleSaveChanges,
    handleModalChange,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    setSelectedCategory,
    setError
  };
};

export default useInterestCircles;
