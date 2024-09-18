import React from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PostItem = ({ post, onPostClick, onToggleLike }) => {
  
  // Handle post click event, preventing default navigation and triggering onPostClick
  const handlePostClick = (e) => {
    e.preventDefault();
    onPostClick(post.id); // Pass the post ID to the parent handler
  };

  // Handle toggling of likes, based on whether the post is already liked (like_id present)
  const handleLikeToggle = () => {
    onToggleLike(post.id, !!post.like_id, post.like_id); // Pass like status and ID to the parent handler
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-xs">
      
      {/* Profile Header - Displays profile image and owner details */}
      <div className="flex items-center p-3 border-b border-gray-200 cursor-pointer">
        <img
          src={post.profile_image || 'default-profile-pic.jpg'} // Fallback to default if profile image is not available
          alt={`${post.owner}'s profile`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <Link to={`/profile/${post.owner_profile_id}`} className="font-semibold text-base hover:text-blue-500">
            {post.owner}
          </Link>
          <p className="text-gray-500 text-xs">
            {new Date(post.created_at).toLocaleDateString()} {/* Display formatted post date */}
          </p>
        </div>
      </div>

      {/* Post Image - Displays post image or video with fallback to default */}
      <img
        src={post.image_or_video || 'default-image.jpg'}
        alt={post.title}
        className="w-full h-40 object-cover"
      />

      {/* Post Content - Title and Like Button */}
      <div className="p-3">
        <a
          href={`/posts/${post.id}`} // Use an anchor tag for semantic links, handled by the click event
          className="text-gray-700 font-semibold text-lg hover:text-blue-500"
          onClick={handlePostClick}
        >
          {post.title}
        </a>
        <div className="flex items-center mt-2">
          <button
            className="flex items-center text-gray-500 hover:text-blue-500 text-sm"
            onClick={handleLikeToggle}
          >
            {/* Thumbs up icon and like/unlike text, conditionally styled based on like status */}
            <FaThumbsUp className={`mr-1 ${post.like_id ? 'text-blue-500' : 'text-gray-500'}`} />
            {post.like_id ? 'Unlike' : 'Like'} ({post.likes_count}) {/* Show like count */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
