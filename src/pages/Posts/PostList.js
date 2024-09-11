// src/pages/Posts/PostList.js
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
    setPosts, // Ensure setPosts is destructured from usePostContent
  } = usePostContent(history);

  if (loading && filteredPosts.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {error && <ErrorModal message={error} onClose={handleCloseModal} />}

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearFilters={handleClearFilters}
      />

      {filteredPosts.length === 0 && searchQuery && (
        <div className="text-center mt-8">
          <h1>No Posts Found for "{searchQuery}"</h1>
          <p>Please try clearing the search bar or adjusting your search query.</p>
        </div>
      )}

      <InfiniteScroll
        dataLength={filteredPosts.length}
        next={() => fetchMoreData(posts, setPosts)} // Pass setPosts here
        hasMore={!!posts.next}
        loader={<p className="text-center mt-2">Loading more posts...</p>}
      >
        <div className="flex flex-row flex-wrap justify-center gap-4 py-4 px-4">
          {filteredPosts.map((post) => (
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
