import React from 'react';
import ErrorModal from '../../components/ErrorModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import useProfile from '../../hooks/useProfile';

const Profile = () => {
  const {
    profile,
    filteredPosts,
    filteredLikedPosts,
    loading,
    isFollowing,
    errorMessage,
    showErrorModal,
    handleFollow,
    handleEditProfile,
    setShowErrorModal,
  } = useProfile();

  if (loading || !profile) return <LoadingSpinner />;

  const renderProfileImage = () => (
    <img
      src={profile.image || "https://via.placeholder.com/150"}
      alt={`${profile.username || 'Profile'}'s profile`}
      className="w-32 h-32 object-cover rounded-full border-2 border-gray-300 mb-4"
    />
  );

  const renderAboutMe = () => (
    <div className="text-lg text-gray-700 mt-4 p-4 rounded-md shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">About Me</h2>
      <p style={{ whiteSpace: 'pre-line' }}>
        {profile.about_me || 'No details provided.'}
      </p>
    </div>
  );

  const renderInterest = () => (
    <p className="text-lg font-semibold text-gray-700 mt-4 p-2 rounded-md shadow-sm">
      Main Interest: <span className="text-blue-600">{profile.interest_name || 'Main Interest'}</span>
    </p>
  );

  const renderFollowButton = () => (
    !profile.is_owner && (
      <button
        onClick={handleFollow}
        className={`py-2 px-4 rounded ${isFollowing ? 'bg-red-500' : 'bg-blue-500'} text-white`}
      >
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    )
  );

  const renderEditProfileButton = () => (
    profile.is_owner && (
      <button
        onClick={handleEditProfile}
        className="py-2 px-4 rounded bg-green-500 text-white mt-4"
      >
        Edit Profile
      </button>
    )
  );

  const renderStats = () => (
    <div className="flex flex-col md:flex-row w-full mb-6">
      {['posts_count', 'followers_count', 'following_count'].map((key, index) => (
        <div key={key} className="flex flex-col items-center md:w-1/3 mb-4 md:mb-0">
          <h2 className="text-2xl font-bold text-gray-900">{profile[key] || 0}</h2>
          <p className="text-gray-600">{key.replace('_count', '')}</p>
        </div>
      ))}
    </div>
  );

  const renderList = (items = [], title) => (
    <div className="bg-white p-6 rounded-none shadow-none mr-5 md:mr-20 mt-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="overflow-y-auto max-h-48">
        {items.length > 0 ? (
          <ul className="space-y-4">
            {items.map(item => (
              <li key={item.id} className="border-b pb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  <a href={`/posts/${item.id}`} className="text-blue-500 hover:underline">
                    {item.title || item.post_title}
                  </a>
                </h3>
                <p className="text-gray-600">
                  {item.owner || 'No owner information available.'}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No recent posts available.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row p-6 min-h-screen bg-slate-400 mt-16 md:mt-0">
      <div className="flex flex-col items-center mb-8 md:mb-4 md:w-1/3">
        {renderProfileImage()}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{profile.owner || 'Username'}</h1>
        {renderAboutMe()}
        {renderInterest()}
        {renderFollowButton()}
        {renderEditProfileButton()}
      </div>
      <div className="flex flex-col md:w-2/3">
        {renderStats()}
        {renderList(filteredLikedPosts, 'Recent Liked Posts')}
        {renderList(filteredPosts, 'Recent Posts')}
      </div>
      {showErrorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
};

export default Profile;
