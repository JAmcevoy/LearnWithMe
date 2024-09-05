import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { FaPlusCircle, FaInfoCircle, FaEdit, FaTrash } from "react-icons/fa";
import DeleteConfirmation from '../../components/DeleteModal'; // Import the DeleteConfirmation component
import { useCurrentUser } from "../../context/CurrentUserContext";

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

const CircleCard = ({ circle, onClick, onInfoClick, onEditClick, onDeleteClick }) => (
  <div
    className="relative flex items-center justify-center cursor-pointer"
    onClick={onClick}
  >
    <div className="relative bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex flex-col items-center justify-center w-44 h-44 text-center text-lg font-semibold text-white shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl">
      <div className="absolute inset-0 bg-black opacity-10 rounded-full"></div>
      <h2 className="relative z-10 text-xl font-bold">{circle.name}</h2>
      <p className="relative z-10 text-sm">{circle.owner}</p>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onInfoClick();
        }}
        className="absolute top-2 left-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition"
      >
        <FaInfoCircle className="text-blue-500" />
      </button>

      {circle.is_owner && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditClick();
            }}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition"
          >
            <FaEdit className="text-green-500" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(circle.id);
            }}
            className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition"
          >
            <FaTrash className="text-red-500" />
          </button>
        </>
      )}
    </div>
  </div>
);

const CreateCircleButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-indigo-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition flex items-center gap-2"
  >
    <FaPlusCircle className="h-8 w-8" />
    <span className="text-lg font-semibold">Create Circle</span>
  </button>
);

const Modal = ({
  type,
  circle,
  categories,
  selectedCategory,
  onClose,
  onSave,
  onCategoryChange,
  onModalChange,
}) => (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-80 lg:w-1/3">
      {type === "info" ? (
        <>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Description:</h3>
          <p className="mb-4 text-gray-600">{circle.description || "No Description available"}</p>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition"
          >
            Close
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Interest Circle</h2>
          <input
            type="text"
            value={circle.name}
            onChange={(e) => onModalChange("name", e.target.value)}
            className="w-full border-b-2 mb-4 px-2 py-2 focus:outline-none focus:border-blue-400"
            placeholder="Circle Name"
          />
          <textarea
            value={circle.description}
            onChange={(e) => onModalChange("description", e.target.value)}
            className="w-full border-b-2 mb-4 px-2 py-2 focus:outline-none focus:border-blue-400"
            placeholder="Description"
          />
          <div className="mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full border-b-2 px-2 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={onSave}
            className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="ml-2 bg-gray-300 text-gray-800 px-6 py-3 rounded-full shadow-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  </div>
);

export default InterestCircles;
