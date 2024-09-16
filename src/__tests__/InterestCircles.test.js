import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useHistory } from 'react-router-dom';
import InterestCircles from '../pages/Circles/InterestCircles';
import useInterestCircles from '../hooks/useInterestCircles';
import '@testing-library/jest-dom/extend-expect';

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
}));

jest.mock('../hooks/useInterestCircles');

jest.mock('../pages/Circles/CircleCard', () => ({ circle, onClick }) => (
  <div data-testid="circle-card" onClick={onClick}>
    {circle.name}
  </div>
));

jest.mock('../pages/Circles/CreateCircleButton', () => ({ onClick }) => (
  <button data-testid="create-circle-button" onClick={onClick}>
    Create Circle
  </button>
));

jest.mock('../pages/Circles/CircleModal', () => ({ onClose, onSave, onCategoryChange }) => (
  <div data-testid="circle-modal">
    <button onClick={onClose}>Close Modal</button>
    <button onClick={onSave}>Save Changes</button>
  </div>
));

jest.mock('../components/DeleteModal', () => ({ onConfirm, onCancel }) => (
  <div data-testid="delete-modal">
    <button onClick={onConfirm}>Confirm Delete</button>
    <button onClick={onCancel}>Cancel Delete</button>
  </div>
));

jest.mock('../components/ErrorModal', () => ({ message, onClose }) => (
  <div data-testid="error-modal">
    <p>{message}</p>
    <button onClick={onClose}>Close Error</button>
  </div>
));

jest.mock('../components/LoadingSpinner', () => () => (
  <div data-testid="loading-spinner">Loading...</div>
));

describe('InterestCircles Component', () => {
  const mockUseHistory = jest.fn();
  useHistory.mockReturnValue(mockUseHistory);

  const mockUseInterestCircles = {
    circles: [{ id: 1, name: 'Circle 1' }],
    loading: false,
    modal: { visible: false },
    deleteModalVisible: false,
    error: null,
    handleCircleClick: jest.fn(),
    handleCreateCircle: jest.fn(),
    handleInfoClick: jest.fn(),
    handleEditClick: jest.fn(),
    handleDeleteClick: jest.fn(),
    handleCloseModal: jest.fn(),
    handleSaveChanges: jest.fn(),
    handleModalChange: jest.fn(),
    handleConfirmDelete: jest.fn(),
    handleCancelDelete: jest.fn(),
    setSelectedCategory: jest.fn(),
    setError: jest.fn(),
  };

  beforeEach(() => {
    useInterestCircles.mockReturnValue(mockUseInterestCircles);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render interest circles correctly', () => {
    render(<InterestCircles />);

    // Check for the heading
    expect(screen.getByText('Interest Circles')).toBeInTheDocument();

    // Check if CircleCard is rendered
    expect(screen.getByTestId('circle-card')).toBeInTheDocument();
    expect(screen.getByText('Circle 1')).toBeInTheDocument();

    // Check if CreateCircleButton is rendered
    expect(screen.getByTestId('create-circle-button')).toBeInTheDocument();
  });

  it('should show loading spinner when loading is true', () => {
    useInterestCircles.mockReturnValueOnce({ ...mockUseInterestCircles, loading: true });

    render(<InterestCircles />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should open the create circle modal when the create button is clicked', () => {
    render(<InterestCircles />);

    const createButton = screen.getByTestId('create-circle-button');
    fireEvent.click(createButton);

    expect(mockUseInterestCircles.handleCreateCircle).toHaveBeenCalled();
  });

  it('should display modal when modal.visible is true', () => {
    useInterestCircles.mockReturnValueOnce({
      ...mockUseInterestCircles,
      modal: { visible: true, circle: null, type: 'create' },
    });

    render(<InterestCircles />);

    expect(screen.getByTestId('circle-modal')).toBeInTheDocument();

    // Simulate closing the modal
    fireEvent.click(screen.getByText('Close Modal'));
    expect(mockUseInterestCircles.handleCloseModal).toHaveBeenCalled();
  });

  it('should show delete confirmation modal when deleteModalVisible is true', () => {
    useInterestCircles.mockReturnValueOnce({
      ...mockUseInterestCircles,
      deleteModalVisible: true,
    });

    render(<InterestCircles />);

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();

    // Simulate clicking confirm delete
    fireEvent.click(screen.getByText('Confirm Delete'));
    expect(mockUseInterestCircles.handleConfirmDelete).toHaveBeenCalled();

    // Simulate clicking cancel delete
    fireEvent.click(screen.getByText('Cancel Delete'));
    expect(mockUseInterestCircles.handleCancelDelete).toHaveBeenCalled();
  });

  it('should show error modal when error exists', () => {
    useInterestCircles.mockReturnValueOnce({
      ...mockUseInterestCircles,
      error: 'Test error message',
    });

    render(<InterestCircles />);

    expect(screen.getByTestId('error-modal')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();

    // Simulate closing the error modal
    fireEvent.click(screen.getByText('Close Error'));
    expect(mockUseInterestCircles.setError).toHaveBeenCalledWith(null);
  });
});
