import React, { useEffect, useState, useCallback } from "react";
import { FaThumbsUp } from "react-icons/fa";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory, Link } from "react-router-dom";
import styles from "../../styles/Search.module.css";
import ErrorModal from "../../components/ErrorModal";

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

  // Function to fetch posts from the API
  const fetchPosts = useCallback(async (url, isInitialFetch = false) => {
    if (!url) return;

    try {
      const response = await axios.get(url);
      const newResults = response.data.results.filter(
        (newPost) => !posts.results.some((post) => post.id === newPost.id)
      );

      setPosts((prevPosts) => ({
        results: isInitialFetch ? newResults : [...prevPosts.results, ...newResults],
        next: response.data.next,
      }));

      applyFilters(searchQuery, isInitialFetch ? newResults : [...posts.results, ...newResults]);
    } catch (err) {
      setError("Error fetching posts. Please try again later.");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, [applyFilters, searchQuery, posts.results]);

  // Fetch posts on initial mount
  useEffect(() => {
    setLoading(true);
    fetchPosts("/posts/", true);
  }, []);

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
    return <p className="text-center mt-8">Loading posts...</p>;
  }

  return (
    <>
      {/* Render error modal if there is an error */}
      {error && <ErrorModal message={error} onClose={handleCloseModal} />}

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by title or owner..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.searchBar}
        />
        {searchQuery && (
          <button onClick={handleClearFilters} className={styles.clearButton}>
            Clear Search
          </button>
        )}
      </div>

      {filteredPosts.length === 0 && searchQuery && (
        <div className="text-center mt-8">
          <h1>No Posts Found for "{searchQuery}"</h1>
          <p>Please try clearing the search bar or adjusting your search query.</p>
        </div>
      )}

      <InfiniteScroll
        dataLength={filteredPosts.length}
        next={() => fetchPosts(posts.next)}
        hasMore={!!posts.next}
        loader={<p className="text-center mt-8">Loading more posts...</p>}
      >
        <div className="flex flex-row flex-wrap justify-center gap-4 py-4 px-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-xs"
            >
              <div className="flex items-center p-3 border-b border-gray-200 cursor-pointer">
                <img
                  src={post.profile_image || "default-profile-pic.jpg"}
                  alt={`${post.owner}'s profile`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <Link to={`/profile/${post.owner_profile_id}`} className="font-semibold text-sm">
                    {post.owner}
                  </Link>
                  <p className="text-gray-500 text-xs">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <img
                src={post.image_or_video || "default-image.jpg"}
                alt={post.title}
                className="w-full h-40 object-cover"
              />

              <div className="p-3">
                <a
                  href={`/posts/${post.id}`}
                  className="text-gray-700 font-semibold text-sm hover:text-blue-500"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePostClick(post.id);
                  }}
                >
                  {post.title}
                </a>
                <div className="flex items-center mt-2">
                  <button
                    className="flex items-center text-gray-500 hover:text-blue-500 text-sm"
                    onClick={() =>
                      toggleLike(post.id, !!post.like_id, post.like_id)
                    }
                  >
                    <FaThumbsUp className={`mr-1 ${post.like_id ? "text-blue-500" : "text-gray-500"}`} />
                    {post.like_id ? "Unlike" : "Like"} ({post.likes_count})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default PostContent;
