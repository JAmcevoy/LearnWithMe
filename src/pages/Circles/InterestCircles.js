import React from "react";
import { useHistory } from "react-router-dom";
import CircleCard from "./CircleCard";
import CreateCircleButton from "./CreateCircleButton";
import Modal from "./CircleModal";
import DeleteConfirmation from "../../components/DeleteModal";
import ErrorModal from "../../components/ErrorModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import useInterestCircles from "../../hooks/useInterestCircles";

const InterestCircles = () => {
  const history = useHistory();
  const {
    circles,
    loading,
    modal,
    categories,
    selectedCategory,
    deleteModalVisible,
    error,
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
  } = useInterestCircles(history);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col">
       <div className="p-6 lg:pr-20 flex-grow">
       <h1 className="text-4xl font-bold text-center text-gray-700 leading-relaxed mb-8 mt-16 sm:mt-10">
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

      {error && (
        <ErrorModal
          message={error}
          onClose={() => setError(null)} 
        />
      )}
    </div>
  );
};

export default InterestCircles;
