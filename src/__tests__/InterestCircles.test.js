import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import InterestCircles from '../pages/circles/InterestCircles';
import useInterestCircles from '../hooks/useInterestCircles';
import { waitFor } from '@testing-library/react';

// Mock the useInterestCircles hook
jest.mock('../hooks/useInterestCircles', () => jest.fn());

describe('InterestCircles Component', () => {
  const mockUseInterestCircles = {
    circles: { results: [], next: null },
    loading: false,
    modal: { visible: false },
    categories: [],
    selectedCategory: null,
    deleteModalVisible: false,
    error: null,
    handleCircleClick: jest.fn(),
    handleCreateCircle: jest.fn(),
    handleInfoClick: jest.fn(),
    handleEditClick: jest.fn(),
    handleCloseModal: jest.fn(),
    handleSaveChanges: jest.fn(),
    handleModalChange: jest.fn(),
    handleDeleteClick: jest.fn(),
    handleConfirmDelete: jest.fn(),
    handleCancelDelete: jest.fn(),
    setSelectedCategory: jest.fn(),
    setError: jest.fn(),
    setCircles: jest.fn(),
  };

  beforeEach(() => {
    useInterestCircles.mockReturnValue(mockUseInterestCircles);
  });

  it('should render the heading', () => {
    render(
      <MemoryRouter>
        <InterestCircles />
      </MemoryRouter>
    );
    expect(screen.getByText(/Interest Circles/i)).toBeInTheDocument();
  });

  it('should display loading spinner when loading', () => {
    mockUseInterestCircles.loading = true;
    render(
      <MemoryRouter>
        <InterestCircles />
      </MemoryRouter>
    );
    expect(screen.getByText(/Just a moment!/i)).toBeInTheDocument();
  });


  it('should display no circles found message when there are no circles', () => {
    mockUseInterestCircles.loading = false;
    mockUseInterestCircles.circles.results = [];
    render(
      <MemoryRouter>
        <InterestCircles />
      </MemoryRouter>
    );
    expect(screen.getByText(/No Circles Found/i)).toBeInTheDocument();
  });

  it('should call handleCircleClick when a circle card is clicked', () => {
    mockUseInterestCircles.circles.results = [
      { id: 1, name: 'Test Circle' },
    ];
    render(
      <MemoryRouter>
        <InterestCircles />
      </MemoryRouter>
    );
    const circleCard = screen.getByText(/Test Circle/i);
    fireEvent.click(circleCard);
    expect(mockUseInterestCircles.handleCircleClick).toHaveBeenCalledWith(1);
  });

  it('should call handleCreateCircle when create button is clicked', () => {
    render(
      <MemoryRouter>
        <InterestCircles />
      </MemoryRouter>
    );
    const createButton = screen.getByRole('button', { name: /Create Circle/i });
    fireEvent.click(createButton);
    expect(mockUseInterestCircles.handleCreateCircle).toHaveBeenCalled();
  });
});
