import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import { useCurrentUser } from "../../context/CurrentUserContext";
import ErrorModal from '../../components/ErrorModal'; // Import ErrorModal

const Profile = () => {
  const { id } = useParams();
  const history = useHistory();
  const [profile, setProfile] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [allLikedPosts, setAllLikedPosts] = useState([]);
  const [filteredLikedPosts, setFilteredLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch profile data
        const profileResponse = await axiosReq.get(`/profiles/${id}/`);
        setProfile(profileResponse.data);

        // Check if the current user is following the profile owner
        setIsFollowing(profileResponse.data.following_id);

        // Fetch all posts
        const postsResponse = await axiosReq.get(`/posts/`);
        setAllPosts(postsResponse.data.results || []);

        // Fetch all liked posts
        const likedPostsResponse = await axiosReq.get(`/likes/`);
        setAllLikedPosts(likedPostsResponse.data.results || []);
      } catch (err) {
        const errorMessage = err.response ? err.response.data : err.message;
        setErrorMessage(`Error fetching profile data: ${errorMessage}`);
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  useEffect(() => {
    // Filter posts whenever the profile or allPosts changes
    if (profile) {
      setFilteredPosts(allPosts.filter(post => post.owner_profile_id === profile.id));
    }
  }, [profile, allPosts]);

  useEffect(() => {
    // Filter liked posts whenever the profile or allLikedPosts changes
    if (profile) {
      setFilteredLikedPosts(allLikedPosts.filter(like => like.owner_profile_id === profile.id));
    }
  }, [profile, allLikedPosts]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        // Unfollow
        await axiosReq.delete(`/followers/${profile.following_id}/`);
        setIsFollowing(false);
        setProfile(prevProfile => ({
          ...prevProfile,
          followers_count: prevProfile.followers_count - 1,
        }));
      } else {
        // Follow
        await axiosReq.post(`/followers/`, {
          owner: currentUser.pk,
          followed: id
        });
        setIsFollowing(true);
        setProfile(prevProfile => ({
          ...prevProfile,
          followers_count: prevProfile.followers_count + 1,
        }));
      }
    } catch (err) {
      const errorMessage = err.response ? err.response.data : err.message;
      setErrorMessage(`Error following/unfollowing: ${errorMessage}`);
      setShowErrorModal(true);
    }
  };

  const handleEditProfile = () => {
    history.push(`/profiles/${id}/edit`);
  };

  const formatSteps = (stepsText) => {
    return stepsText
      .split('\n')
      .map((line, index) => <p key={index} className="mb-2">{line}</p>);
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row p-6 min-h-screen bg-slate-400 mt-16 md:mt-0">
      <div className="flex flex-col items-center mb-8 md:mb-4 md:w-1/3">
        <img
          src={profile.image || "https://via.placeholder.com/150"}
          alt={`${profile.username || 'Profile'}'s profile`}
          className="w-32 h-32 object-cover rounded-full border-2 border-gray-300 mb-4"
        />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{profile.owner || 'Username'}</h1>
        
        {/* About Me Section */}
        <div className="text-lg text-gray-700 mt-4 p-4 rounded-md shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">About Me</h2>
          <div>
            {profile.about_me ? formatSteps(profile.about_me) : 'No details provided.'}
          </div>
        </div>

        {/* Main Interest Section */}
        <p className="text-lg font-semibold text-gray-700 mt-4 p-2 rounded-md shadow-sm">
          Main Interest: <span className="text-blue-600">{profile.interest_name || 'Main Interest'}</span>
        </p>

        {/* Follow Button */}
        {!profile.is_owner && (
          <button
            onClick={handleFollow}
            className={`py-2 px-4 rounded ${isFollowing ? 'bg-red-500' : 'bg-blue-500'} text-white`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}

        {/* Edit Profile Button */}
        {profile.is_owner && (
          <button
            onClick={handleEditProfile}
            className="py-2 px-4 rounded bg-green-500 text-white mt-4"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="flex flex-col md:w-2/3">
        <div className="flex flex-col md:flex-row w-full mb-6">
          <div className="flex flex-col items-center md:w-1/3 mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-900">{profile.posts_count || 0}</h2>
            <p className="text-gray-600">Posts</p>
          </div>
          <div className="flex flex-col items-center md:w-1/3 mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-900">
              {profile.followers_count || 0}
            </h2>
            <p className="text-gray-600">Followers</p>
          </div>
          <div className="flex flex-col items-center md:w-1/3">
            <h2 className="text-2xl font-bold text-gray-900">
              {profile.following_count || 0}
            </h2>
            <p className="text-gray-600">Following</p>
          </div>
        </div>

        {/* Liked Posts Section */}
        <div className="bg-white p-6 rounded-none shadow-none mr-5 md:mr-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Liked Posts</h2>
          <div className="overflow-y-auto max-h-48">
            {filteredLikedPosts.length > 0 ? (
              <ul className="space-y-4">
                {filteredLikedPosts.map((like) => (
                  <li key={like.post.id} className="border-b pb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      <a href={`/posts/${like.post}`} className="text-blue-500 hover:underline">
                        {like.post_title}
                      </a>
                    </h3>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No recent liked posts available.</p>
            )}
          </div>
        </div>

        {/* Recent Posts Section */}
        <div className="bg-white p-6 rounded-none shadow-none mr-5 md:mr-20 mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Posts</h2>
          <div className="overflow-y-auto max-h-48">
            {filteredPosts.length > 0 ? (
              <ul className="space-y-4">
                {filteredPosts.map((post) => (
                  <li key={post.id} className="border-b pb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      <a href={`/posts/${post.id}`} className="text-blue-500 hover:underline">
                        {post.title}
                      </a>
                    </h3>
                    <p className="text-gray-600">{post.owner || 'No owner information available.'}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No recent posts available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Render Error Modal */}
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
