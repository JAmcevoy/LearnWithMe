import React from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PostItem = ({ post, onPostClick, onToggleLike }) => {
  const handlePostClick = (e) => {
    e.preventDefault();
    onPostClick(post.id);
  };

  const handleLikeToggle = () => {
    onToggleLike(post.id, !!post.like_id, post.like_id);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-xs">
      {/* Profile Header */}
      <div className="flex items-center p-3 border-b border-gray-200 cursor-pointer">
        <img
          src={post.profile_image || 'default-profile-pic.jpg'}
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

      {/* Post Image */}
      <img
        src={post.image_or_video || 'default-image.jpg'}
        alt={post.title}
        className="w-full h-40 object-cover"
      />

      {/* Post Content */}
      <div className="p-3">
        <a
          href={`/posts/${post.id}`}
          className="text-gray-700 font-semibold text-sm hover:text-blue-500"
          onClick={handlePostClick}
        >
          {post.title}
        </a>
        <div className="flex items-center mt-2">
          <button
            className="flex items-center text-gray-500 hover:text-blue-500 text-sm"
            onClick={handleLikeToggle}
          >
            <FaThumbsUp className={`mr-1 ${post.like_id ? 'text-blue-500' : 'text-gray-500'}`} />
            {post.like_id ? 'Unlike' : 'Like'} ({post.likes_count})
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
