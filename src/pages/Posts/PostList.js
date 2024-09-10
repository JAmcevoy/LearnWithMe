import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { fetchMoreData } from '../../utils/utils'; 
import SearchBar from '../../components/SearchBar';
import PostItem from './PostItem';
import ErrorModal from '../../components/ErrorModal';
import LoadingSpinner from '../../components/LoadingSpinner';

const PostContent = () => {
  const [posts, setPosts] = useState({ results: [], next: null });
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const history = useHistory();

  // Function to apply search filters to posts
  const applyFilters = useCallback((query, postsToFilter) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = postsToFilter.filter((post) => {
      const titleMatches = post.title?.toLowerCase().includes(lowercasedQuery);
      const ownerMatches = post.owner?.toLowerCase().includes(lowercasedQuery);
      return titleMatches || ownerMatches;
    });
    setFilteredPosts(filtered);
  }, []);

  // Fetch initial posts on component mount
  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        const { data } = await axios.get("/posts/"); 
        setPosts({ results: data.results, next: data.next });
        applyFilters(searchQuery, data.results);
      } catch (err) {
        setError("Error fetching posts. Please try again later.");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialPosts();
  }, [applyFilters, searchQuery]);

  // Reapply filters when searchQuery or posts change
  useEffect(() => {
    applyFilters(searchQuery, posts.results);
  }, [searchQuery, posts.results, applyFilters]);

  // Handle post click to navigate to post details
  const handlePostClick = (id) => {
    history.push(`/posts/${id}`);
  };

  // Handle like and unlike post actions
  const toggleLike = async (id, isLiked, likeId) => {
    try {
      if (isLiked) {
        await axios.delete(`/likes/${likeId}/`);
        updatePostLikes(id, -1, null);
      } else {
        const { data } = await axios.post("/likes/", { post: id });
        updatePostLikes(id, +1, data.id);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  // Update the post's like count and like ID in the state
  const updatePostLikes = (id, likeChange, likeId) => {
    setPosts((prevPosts) => ({
      ...prevPosts,
      results: prevPosts.results.map((post) =>
        post.id === id
          ? { ...post, likes_count: post.likes_count + likeChange, like_id: likeId }
          : post
      ),
    }));
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Clear search filters
  const handleClearFilters = () => {
    setSearchQuery("");
    applyFilters("", posts.results);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setError(null);
  };

  if (loading && filteredPosts.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Render error modal if there is an error */}
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
        next={() => fetchMoreData(posts, setPosts)} // Fetch more posts when scrolling
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

export default PostContent;
