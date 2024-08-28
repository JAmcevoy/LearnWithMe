import React, { useState, useEffect } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { axiosReq } from "../api/axiosDefaults.js"; // Adjust the import path as necessary

const PostContent = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosReq.get('/posts/');
        // Ensure response.data is an array
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        console.error("Error fetching posts:", error.response || error.message);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-row flex-wrap justify-center gap-6 py-8 px-4 min-h-screen">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-sm"
          >
            <div className="flex items-center p-4 border-b border-gray-200">
              <img
                src={post.profilePic}
                alt={`${post.userName}'s profile`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-4">
                <h2 className="font-semibold">{post.userName}</h2>
                <p className="text-gray-500 text-sm">{post.postTime}</p>
              </div>
            </div>
            <img
              src={post.image}
              alt={post.description}
              className="w-full h-auto object-cover"
            />
            <div className="p-4">
              <p className="text-gray-700 mb-4">{post.description}</p>
              <div className="flex items-center space-x-6">
                <button className="flex items-center text-gray-500 hover:text-blue-500">
                  <FaThumbsUp className="mr-2" /> Like
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center min-h-screen text-gray-500">No posts available.</div>
      )}
    </div>
  );
};

export default PostContent;
