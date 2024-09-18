import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const usePostContent = (history) => {
  const [posts, setPosts] = useState({ results: [], next: null }); // State for storing posts and pagination info
  const [filteredPosts, setFilteredPosts] = useState([]); // State for filtered posts based on search query
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state for handling errors
  const [searchQuery, setSearchQuery] = useState(''); // State for search input

  /**
   * Function to filter posts based on the search query.
   */
  const applyFilters = useCallback((query, postsToFilter) => {
    const lowercasedQuery = query.toLowerCase(); // Convert query to lowercase for case-insensitive search
    const filtered = postsToFilter.filter((post) => {
      const titleMatches = post.title?.toLowerCase().includes(lowercasedQuery); // Check if title matches the query
      const ownerMatches = post.owner?.toLowerCase().includes(lowercasedQuery); // Check if owner matches the query
      return titleMatches || ownerMatches; // Return posts that match either the title or the owner
    });
    setFilteredPosts(filtered); // Update the filteredPosts state
  }, []);

  /**
   * Fetches the initial list of posts and applies filters when the component is mounted.
   */
  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        const { data } = await axios.get('/posts/'); // API call to fetch posts
        setPosts({ results: data.results, next: data.next }); // Set posts and pagination info
        applyFilters(searchQuery, data.results); // Apply filters based on the search query
      } catch (err) {
        setError('Error fetching posts. Please try again later.'); // Handle fetch error
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchInitialPosts(); // Call the function when the component mounts
  }, [applyFilters, searchQuery]);

  /**
   * Reapplies filters whenever the searchQuery or posts change.
   */
  useEffect(() => {
    applyFilters(searchQuery, posts.results);
  }, [searchQuery, posts.results, applyFilters]);

  /**
   * Handle click event on a post and navigate to the post details page.
   */
  const handlePostClick = (id) => {
    history.push(`/posts/${id}`); // Redirect to post details page
  };

  /**
   * Toggles like/unlike functionality for a post.
   */
  const toggleLike = async (id, isLiked, likeId) => {
    try {
      if (isLiked) {
        await axios.delete(`/likes/${likeId}/`); // Unlike the post
        updatePostLikes(id, -1, null); // Update post likes state
      } else {
        const { data } = await axios.post('/likes/', { post: id }); // Like the post
        updatePostLikes(id, 1, data.id); // Update post likes state
      }
    } catch (err) {
      console.error('Error toggling like:', err); // Log any errors that occur
    }
  };

  /**
   * Update the post's like count and like ID in the state.
   */
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

  /**
   * Handle search input change and update the search query state.
   */
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query
  };

  /**
   * Clear the search filters and reset the search query.
   */
  const handleClearFilters = () => {
    setSearchQuery(''); // Clear search query
    applyFilters('', posts.results); // Reset the filtered posts
  };

  /**
   * Close the error modal.
   */
  const handleCloseModal = () => {
    setError(null); // Clear error state
  };

  return {
    posts, // List of posts
    filteredPosts, // Filtered posts based on search
    loading, // Loading state
    error, // Error state
    searchQuery, // Current search query
    handlePostClick, // Function to handle post click
    toggleLike, // Function to toggle like/unlike on a post
    handleSearchChange, // Function to handle search input change
    handleClearFilters, // Function to clear search filters
    handleCloseModal, // Function to close the error modal
    setPosts, // Setter for posts state
  };
};

export default usePostContent;
