import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import CircleCard from "./CircleCard";
import CreateCircleButton from "./CreateCircleButton"; 
import Modal from "./CircleModal"; 
import DeleteConfirmation from "../../components/DeleteModal"; 

const InterestCircles = () => {
  const history = useHistory();
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchCircles();
    fetchCategories();
  }, []);

  const fetchCircles = async () => {
    try {
      const { data } = await axios.get("/interest-circles/");
      setCircles(data.results || data);
    } catch (err) {
      handleError("Error fetching interest circles", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/categories/");
      setCategories(data.results || []);
    } catch (err) {
      handleError("Error fetching categories", err);
    }
  };

  const handleError = (message, err) => {
    setError(message);
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
      await axios.put(`/interest-circles/${modal.circle.id}/`, {
        name: modal.circle.name,
        description: modal.circle.description,
        category: selectedCategory,
      });
      await fetchCircles();
      handleCloseModal();
    } catch (err) {
      handleSaveError(err);
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
      await axios.delete(`/interest-circles/${circleToDelete}/`);
      setCircles((prevCircles) => prevCircles.filter((circle) => circle.id !== circleToDelete));
      setDeleteModalVisible(false); 
      setCircleToDelete(null); 
    } catch (err) {
      handleDeleteError(err);
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

  if (loading) {
    return <p className="text-center mt-8">Loading interest circles...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-6 lg:pr-20 flex-grow">
        <h1 className="text-4xl font-bold text-center text-gray-700 leading-relaxed mb-8 mt-10 sm:mt-3">
          Interest Circles
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {circles.length > 0 ? (
            circles.map((circle) => (
              <CircleCard
                key={circle.id}
                circle={circle}
                onClick={() => handleCircleClick(circle.id)}
                onInfoClick={() => handleInfoClick(circle)}
                onEditClick={() => handleEditClick(circle)}
                onDeleteClick={handleDeleteClick}
              />
            ))
          ) : (
            <p className="text-center mt-8">No interest circles available</p>
          )}
        </div>
      </div>
      <CreateCircleButton onClick={handleCreateCircle} />

      {modal.visible && (
        <Modal
          type={modal.type}
          circle={modal.circle}
          categories={categories}
          selectedCategory={selectedCategory}
          onClose={handleCloseModal}
          onSave={handleSaveChanges}
          onCategoryChange={setSelectedCategory}
          onModalChange={handleModalChange}
        />
      )}

      {deleteModalVisible && (
        <DeleteConfirmation
          message="Are you sure you want to delete this interest circle?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default InterestCircles;
