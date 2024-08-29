import React, { useState, useEffect } from 'react';
import { FaThumbsUp } from "react-icons/fa";
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PostDetails = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/posts/${id}/`);
                setPost(response.data);
            } catch (err) {
                console.error('Error fetching post details:', err);
                setError('Error fetching post details.');
            }
        };

        fetchPost();
    }, [id]);

    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="flex flex-col items-center min-h-screen bg-slate-400 p-4">
            <div className="w-full max-w-5xl">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">Post Details</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Media Section */}
                    <div className="flex-none w-full md:w-1/2">
                        {post?.image_or_video ? (
                            <img
                                src={post.image_or_video}
                                alt="Post Content"
                                className="w-full h-auto object-cover rounded-lg shadow-lg"
                            />
                        ) : (
                            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg shadow-lg">
                                <p className="text-gray-500">No Media Available</p>
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="text-3xl font-extrabold mb-4 text-gray-900">{post?.title}</h2>
                        <div className="flex items-center mb-4">
                            <img
                                src={post?.profile_image || "https://via.placeholder.com/48"}
                                alt="Profile"
                                className="w-12 h-12 rounded-full mr-4"
                            />
                            <div>
                                <p className="text-xl font-semibold text-gray-900">{post?.owner}</p>
                                <p className="text-sm text-gray-500">{new Date(post?.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Steps</h3>
                            <p className="text-gray-700">{post?.steps || 'No steps provided.'}</p>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Category</h3>
                            <p className="text-gray-700">{post?.category || 'No category assigned.'}</p>
                        </div>
                        <div className="mb-6">
                            <p className="text-gray-700">
                                <span className="font-semibold">Likes:</span> {post?.likes_count || 0}
                            </p>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center space-x-6">
                                <button className="flex items-center text-gray-500 hover:text-blue-500">
                                    <FaThumbsUp className="mr-2" /> Like
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetails;
