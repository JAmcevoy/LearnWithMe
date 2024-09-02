import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import { useCurrentUser } from "../../context/CurrentUserContext";

const Profile = () => {
  const { id } = useParams(); // Profile ID from URL params
  const [profile, setProfile] = useState(null);
  const [allPosts, setAllPosts] = useState([]); // Store all posts
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
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
      } catch (err) {
        console.error('Error fetching data:', err);
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
      console.error('Error following/unfollowing:', err.message);
    }
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
        <p className="text-black-600 text-lg mb-6">{profile.about_me || 'About Me'}</p>
        
        {/* Follow Button */}
        {!profile.is_owner && (
          <button
            onClick={handleFollow}
            className={`py-2 px-4 rounded ${isFollowing ? 'bg-red-500' : 'bg-blue-500'} text-white`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
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

        {/* Recent Posts Section */}
        <div className="bg-white p-6 rounded-none shadow-none mr-5 md:mr-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Posts</h2>
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
  );
};

export default Profile;
