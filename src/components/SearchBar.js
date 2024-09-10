import React from 'react';
import styles from '../styles/Search.module.css';

const SearchBar = ({ searchQuery, onSearchChange, onClearFilters }) => {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search by title or owner..."
        value={searchQuery}
        onChange={onSearchChange}
        className={styles.searchBar}
      />
      {searchQuery && (
        <button onClick={onClearFilters} className={styles.clearButton}>
          Clear Search
        </button>
      )}
    </div>
  );
};

export default SearchBar;