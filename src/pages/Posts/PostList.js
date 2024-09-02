import React, { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory, Link } from "react-router-dom";
import styles from "../../styles/Search.module.css"; // Import the CSS module

const PostContent = () => {
  const [posts, setPosts] = useState({ results: [], next: null });
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const history = useHistory();

  const fetchPosts = async (url) => {
    if (!url) return;
    try {
      const response = await axios.get(url);
      setPosts((prevPosts) => ({
        results: [...prevPosts.results, ...response.data.results],
        next: response.data.next,
      }));
      applyFilters(searchQuery, [...posts.results, ...response.data.results]);
    } catch (err) {
      setError("Error fetching posts. Please try again later.");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (query, postsToFilter) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = postsToFilter.filter((post) => {
      const titleMatches = post.title?.toLowerCase().includes(lowercasedQuery);
      const ownerMatches = post.owner?.toLowerCase().includes(lowercasedQuery);
      return titleMatches || ownerMatches;
    });
    setFilteredPosts(filtered);
  };

  useEffect(() => {
    setLoading(true);
    fetchPosts("/posts/");
  }, []);

  useEffect(() => {
    applyFilters(searchQuery, posts.results);
  }, [searchQuery, posts.results]);

  const handlePostClick = (id) => {
    history.push(`/posts/${id}`);
  };

  const handleLike = async (id) => {
    try {
      const { data } = await axios.post("/likes/", { post: id });
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) =>
          post.id === id
            ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
            : post
        ),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async (id, like_id) => {
    try {
      await axios.delete(`/likes/${like_id}/`);
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) =>
          post.id === id
            ? { ...post, likes_count: post.likes_count - 1, like_id: null }
            : post
        ),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    applyFilters("", posts.results);
  };

  if (loading && filteredPosts.length === 0) {
    return <p className="text-center mt-8">Loading posts...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  return (
    <>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by title or owner..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.searchBar}
        />
        {searchQuery && (
          <button
            onClick={handleClearFilters}
            className={styles.clearButton}
          >
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
        <div className="flex flex-row flex-wrap justify-center gap-6 py-8 px-4 min-h-screen">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-sm"
            >
              <div className="flex items-center p-4 border-b border-gray-200 cursor-pointer">
                <img
                  src={post.profile_image || "default-profile-pic.jpg"}
                  alt={`${post.owner}'s profile`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <Link to={`/profile/${post.owner_profile_id}`} className="font-semibold">{post.owner}</Link>
                  <p className="text-gray-500 text-sm">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <img
                src={post.image_or_video || "default-image.jpg"}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
              <div className="p-4">
                <a
                  href={`/posts/${post.id}`}
                  className="text-gray-700 font-semibold hover:text-blue-500"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePostClick(post.id);
                  }}
                >
                  {post.title}
                </a>
                <div className="flex items-center mt-2">
                  <button
                    className="flex items-center text-gray-500 hover:text-blue-500"
                    onClick={() =>
                      post.like_id
                        ? handleUnlike(post.id, post.like_id)
                        : handleLike(post.id)
                    }
                  >
                    <FaThumbsUp className="mr-2" />
                    {post.like_id ? "Unlike" : "Like"}
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
