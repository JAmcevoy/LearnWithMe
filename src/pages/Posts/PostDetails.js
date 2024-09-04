import React, { useState, useEffect, useCallback } from 'react';
import { FaThumbsUp, FaEdit, FaTrash } from "react-icons/fa";
import axios from 'axios';
import { useParams, Link, useHistory } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import { useCurrentUser } from "../../context/CurrentUserContext";

const PostDetails = () => {
    const { id } = useParams();
    const history = useHistory();
    const [post, setPost] = useState(null);
    const [error, setError] = useState('');
    const [liked, setLiked] = useState(false);
    const [likeId, setLikeId] = useState(null);
    const currentUser = useCurrentUser();

    const fetchPost = useCallback(async () => {
        try {
            const response = await axios.get(`/posts/${id}/`);
            const fetchedPost = response.data;
            setPost(fetchedPost);

            if (currentUser) {
                const likedBy = fetchedPost.liked_by || [];
                setLiked(likedBy.includes(currentUser.id));
                setLikeId(fetchedPost.like_id || null);
            }
        } catch (err) {
            console.error('Error fetching post details:', err);
            setError('Error fetching post details.');
        }
    }, [id, currentUser]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

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
    const updatePostLikes = (postId, likeChange, newLikeId) => {
        setPost((prevPost) => ({
            ...prevPost,
            likes_count: prevPost.likes_count + likeChange,
            like_id: newLikeId,
        }));
    };

    const handleDelete = async () => {
        try {
            await axiosReq.delete(`/posts/${id}/`);
            history.goBack();
        } catch (err) {
            console.log('Error deleting post:', err);
            setError('Error deleting post.');
        }
    };

    const formatSteps = (stepsText) => {
        return stepsText
            .split('\n')
            .map((line, index) => <div key={index} className="mb-2">{line}</div>); // Changed <p> to <div>
    };

    if (error) return <p className="text-red-500 text-center">{error}</p>;

    if (!post) return <p className="text-gray-500 text-center">Loading...</p>;

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
                                <Link
                                    to={`/profile/${post?.owner_profile_id}`}
                                    className="text-xl font-semibold text-gray-900">
                                    {post?.owner}
                                </Link>
                                <p className="text-sm text-gray-500">{new Date(post?.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Steps</h3>
                            <div className="text-gray-700">{post?.steps ? formatSteps(post.steps) : 'No steps provided.'}</div>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Category</h3>
                            <p className="text-gray-700">{post?.category_name || 'No category assigned.'}</p>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center space-x-6">
                                <button
                                    className="flex items-center text-gray-500 hover:text-blue-500 text-sm"
                                    onClick={() =>
                                        toggleLike(post.id, !!post.like_id, post.like_id)
                                    }
                                >
                                    <FaThumbsUp className="mr-1" />
                                    {post.like_id ? "Unlike" : "Like"} ({post.likes_count})
                                </button>
                                {post && post.is_owner && (
                                    <>
                                        <Link to={`/posts/edit/${id}`} className="flex items-center text-gray-500 hover:text-blue-500">
                                            <FaEdit className="mr-2" /> Edit
                                        </Link>
                                        <button className="flex items-center text-gray-500 hover:text-blue-500" onClick={handleDelete}>
                                            <FaTrash className="mr-2" /> Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetails;
