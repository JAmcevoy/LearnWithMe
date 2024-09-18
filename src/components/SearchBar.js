import React from 'react';
import styles from '../styles/Search.module.css';

/**
 * SearchBar component to filter content based on search query.
 */
const SearchBar = ({ searchQuery, onSearchChange, onClearFilters }) => {
  return (
    <div className={styles.searchContainer}>
      {/* Input field for search query */}
      <input
        type="text"
        placeholder="Search by title or owner..."
        value={searchQuery}
        onChange={onSearchChange}
        className={styles.searchBar}
        aria-label="Search by title or owner"
      />
      
      {/* Clear button only appears if there is a search query */}
      {searchQuery && (
        <button 
          onClick={onClearFilters} 
          className={styles.clearButton}
          aria-label="Clear search"
        >
          Clear Search
        </button>
      )}
    </div>
  );
};

export default SearchBar;
