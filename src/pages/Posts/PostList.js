import React from 'react';
import { useHistory } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchBar from '../../components/SearchBar';
import PostItem from './PostItem';
import ErrorModal from '../../components/ErrorModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import usePostContent from '../../hooks/usePostList';
import { fetchMoreData } from '../../utils/utils';

const PostList = () => {
  const history = useHistory();
  const {
    posts,
    filteredPosts,
    loading,
    error,
    searchQuery,
    handlePostClick,
    toggleLike,
    handleSearchChange,
    handleClearFilters,
    handleCloseModal,
    setPosts,
  } = usePostContent(history);

  // Display loading spinner when posts are being fetched initially
  if (loading && filteredPosts.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Error Modal - Show if there's an error */}
      {error && <ErrorModal message={error} onClose={handleCloseModal} />}

      {/* Search Bar for filtering posts */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearFilters={handleClearFilters}
      />

      {/* Display message if no posts are found for the search query */}
      {filteredPosts.length === 0 && searchQuery && (
        <div className="text-center mt-8">
          <h1>No Posts Found for "{searchQuery}"</h1>
          <p>Please try clearing the search bar or adjusting your search query.</p>
        </div>
      )}

      {/* Infinite scrolling to load more posts */}
      <InfiniteScroll
        dataLength={filteredPosts.length} // Number of items in the list
        next={() => fetchMoreData(posts, setPosts)} // Function to fetch more data when scroll reaches the bottom
        hasMore={!!posts.next} // Check if there's more data to load
        loader={<p className="text-center mt-2">Loading more posts...</p>} // Loader message
      >
        <div className="flex flex-row flex-wrap justify-center gap-4 py-4 px-4">
          {/* Render each post as a PostItem */}
          {filteredPosts.map(post => (
            <PostItem
              key={post.id}
              post={post}
              onPostClick={handlePostClick}
              onToggleLike={toggleLike}
            />
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default PostList;
