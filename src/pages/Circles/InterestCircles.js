import React from 'react';
import { useHistory } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircleCard from './CircleCard';
import CreateCircleButton from './CreateCircleButton';
import Modal from './CircleModal';
import DeleteConfirmation from '../../components/DeleteModal';
import ErrorModal from '../../components/ErrorModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import useInterestCircles from '../../hooks/useInterestCircles';
import { fetchMoreData } from '../../utils/utils';

const InterestCircles = () => {
  const history = useHistory();
  
  // State and handlers from custom hook
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
    setError,
    setCircles,
  } = useInterestCircles(history);

  const circleList = circles.results || []; // Safely access circle results

  // Function to load more circles with error handling
  const loadMoreCircles = async () => {
    try {
      if (!circles.next) {
        setError('No more circles to load.');
        return;
      }
      await fetchMoreData(circles, setCircles); // Fetch more data using the utility function
    } catch (err) {
      console.error('Error fetching more circles:', err);
      setError('Error loading more circles. Please try again.');
    }
  };

  // Handle save changes with error handling
  const handleSaveChangesWithErrorHandling = async () => {
    try {
      await handleSaveChanges(); // Assume this function saves data
    } catch (err) {
      console.error('Error saving changes:', err);
      setError('An error occurred while saving changes. Please try again.');
    }
  };

  // Handle delete confirmation with error handling
  const handleConfirmDeleteWithErrorHandling = async () => {
    try {
      await handleConfirmDelete(); // Assume this function confirms deletion
    } catch (err) {
      console.error('Error confirming delete:', err);
      setError('An error occurred while deleting the circle. Please try again.');
    }
  };

  // Display a loading spinner while loading data and no circles are yet loaded
  if (loading && circleList.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col mt-16 md:mt-0">
      {/* Page Heading */}
      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold text-gray-800">Interest Circles</h1>
      </div>

      {/* Error Modals */}
      {error && <ErrorModal message={error} onClose={handleCloseModal} />}

      {/* No Circles Found Message */}
      {!loading && circleList.length === 0 && (
        <div className="text-center mt-8">
          <h1>No Circles Found</h1>
        </div>
      )}

      {/* Infinite Scroll */}
      <InfiniteScroll
        dataLength={circleList.length}
        next={loadMoreCircles}
        hasMore={!!circles.next && !error} // Load more only if there's more data and no error
        loader={<p className="text-center mt-2">Loading more circles...</p>}
        endMessage={<p className="text-center mt-2">No more circles to load.</p>}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-8 py-6 px-4">
          {circleList.map((circle) => (
            <CircleCard
              key={circle.id}
              circle={circle}
              onClick={() => handleCircleClick(circle.id)}
              onInfoClick={() => handleInfoClick(circle)}
              onEditClick={() => handleEditClick(circle)}
              onDeleteClick={() => handleDeleteClick(circle.id)}
            />
          ))}
        </div>
      </InfiniteScroll>

      {/* Create Circle Button */}
      <CreateCircleButton onClick={handleCreateCircle} />

      {/* Circle Modal */}
      {modal.visible && (
        <Modal
          type={modal.type}
          circle={modal.circle}
          categories={categories}
          selectedCategory={selectedCategory}
          onClose={handleCloseModal}
          onSave={handleSaveChangesWithErrorHandling}
          onCategoryChange={setSelectedCategory}
          onModalChange={handleModalChange}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalVisible && (
        <DeleteConfirmation
          message="Are you sure you want to delete this interest circle?"
          onConfirm={handleConfirmDeleteWithErrorHandling}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default InterestCircles;
