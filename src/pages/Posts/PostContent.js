import React, { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory } from "react-router-dom";

const PostContent = () => {
  const [posts, setPosts] = useState({ results: [], next: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  const fetchPosts = async (url) => {
    try {
      const response = await axios.get(url);
      setPosts((prevPosts) => ({
        results: [...prevPosts.results, ...response.data.results],
        next: response.data.next,
      }));
    } catch (err) {
      setError("Error fetching posts");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPosts("/posts/");
  }, []);

  if (loading && posts.results.length === 0) {
    return <p className="text-center mt-8">Loading posts...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  if (posts.results.length === 0) {
    return (
      <div className="text-center mt-8">
        <h1>No Posts To Load!</h1>
      </div>
    );
  }

  const handlePostClick = (id) => {
    history.push(`/posts/${id}`);
  };

  return (
    <InfiniteScroll
        dataLength={posts.results.length}
        next={() => fetchPosts(posts.next)}
        hasMore={!!posts.next}
        loader={<p className="text-center mt-8">Loading more posts...</p>}
      >
    <div className="flex flex-row flex-wrap justify-center gap-6 py-8 px-4 min-h-screen">
    
        {posts.results.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-sm"
          >
            <div className="flex items-center p-4 border-b border-gray-200">
              <img
                src={post.profile_image || "default-profile-pic.jpg"}
                alt={`${post.owner}'s profile`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-4">
                <h2 className="font-semibold">{post.owner}</h2>
                <p className="text-gray-500 text-sm">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <img
              src={post.image_or_video || "default-image.jpg"}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-center">
                <button className="flex items-center text-gray-500 hover:text-blue-500">
                  <FaThumbsUp className="mr-2" /> Like
                </button>
                <a
                  href={`/posts/${post.id}`}
                  className="text-gray-700 font-semibold hover:text-blue-500"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default link behavior
                    handlePostClick(post.id); // Navigate programmatically
                  }}
                >
                  {post.title}
                </a>
              </div>
            </div>
          </div>
        ))}
        
    </div>
    </InfiniteScroll>
    
  );
};

export default PostContent;
