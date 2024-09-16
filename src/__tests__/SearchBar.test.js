import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnClearFilters = jest.fn();

  beforeEach(() => {
    // Reset the mock function before each test
    mockOnSearchChange.mockClear();
    mockOnClearFilters.mockClear();
  });

  it('renders the search input with the correct placeholder', () => {
    // Render the component with an empty searchQuery
    render(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} onClearFilters={mockOnClearFilters} />
    );

    // Check if the input is rendered with the correct placeholder
    const inputElement = screen.getByPlaceholderText(/search by title or owner/i);
    expect(inputElement).toBeInTheDocument();
  });

  it('calls onSearchChange when the input value changes', () => {
    // Render the component with an empty searchQuery
    render(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} onClearFilters={mockOnClearFilters} />
    );

    // Find the input and simulate a change event
    const inputElement = screen.getByPlaceholderText(/search by title or owner/i);
    fireEvent.change(inputElement, { target: { value: 'test search' } });

    // Expect onSearchChange to have been called with the new input value
    expect(mockOnSearchChange).toHaveBeenCalled();
  });

  it('shows the "Clear Search" button when searchQuery is not empty', () => {
    // Render the component with a non-empty searchQuery
    render(
      <SearchBar searchQuery="test" onSearchChange={mockOnSearchChange} onClearFilters={mockOnClearFilters} />
    );

    // Check if the "Clear Search" button is rendered
    const clearButton = screen.getByText(/clear search/i);
    expect(clearButton).toBeInTheDocument();
  });

  it('does not show the "Clear Search" button when searchQuery is empty', () => {
    // Render the component with an empty searchQuery
    render(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} onClearFilters={mockOnClearFilters} />
    );

    // Check if the "Clear Search" button is NOT rendered
    const clearButton = screen.queryByText(/clear search/i);
    expect(clearButton).not.toBeInTheDocument();
  });

  it('calls onClearFilters when the "Clear Search" button is clicked', () => {
    // Render the component with a non-empty searchQuery
    render(
      <SearchBar searchQuery="test" onSearchChange={mockOnSearchChange} onClearFilters={mockOnClearFilters} />
    );

    // Find the "Clear Search" button and simulate a click event
    const clearButton = screen.getByText(/clear search/i);
    fireEvent.click(clearButton);

    // Expect onClearFilters to have been called
    expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
  });
});
