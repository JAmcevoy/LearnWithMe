import React, { useState } from 'react';
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
  const [infiniteError, setInfiniteError] = useState(null); // For handling infinite scroll errors

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

  const circleList = circles.results || []; // Ensure we use circles.results directly

  // Enhanced function to fetch more circles with error handling
  const loadMoreCircles = async () => {
    try {
      if (!circles.next) {
        setInfiniteError('No more circles to load.');
        return;
      }
      await fetchMoreData(circles, setCircles);
    } catch (err) {
      console.error('Error fetching more circles:', err);
      setInfiniteError('Error loading more circles. Please try again.');
    }
  };

  if (loading && circleList.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Page Heading */}
      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold text-gray-800">Interest Circles</h1>
      </div>

      {/* Error Modals */}
      {error && <ErrorModal message={error} onClose={handleCloseModal} />}
      {infiniteError && <ErrorModal message={infiniteError} onClose={() => setInfiniteError(null)} />}

      {/* No Circles Found Message */}
      {circleList.length === 0 && !loading && (
        <div className="text-center mt-8">
          <h1>No Circles Found</h1>
        </div>
      )}

      {/* Infinite Scroll */}
      <InfiniteScroll
        dataLength={circleList.length}
        next={loadMoreCircles}
        hasMore={!!circles.next && !infiniteError} // Only load more if there's more data and no error
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

      {/* Modal */}
      {modal.visible && (
        <Modal
          type={modal.type}
          circle={modal.circle}
          categories={categories}
          selectedCategory={selectedCategory}
          onClose={handleCloseModal}
          onSave={handleSaveChanges} // Save handled in hook
          onCategoryChange={setSelectedCategory}
          onModalChange={handleModalChange}
        />
      )}

      {/* Delete Confirmation */}
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
