import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';

const Profile = () => {
  const { id } = useParams(); // Get profile ID from URL
  const [profile, setProfile] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]); // State for recent posts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileResponse = await axiosReq.get(`/profiles/${id}/`); // Fetch profile data
        setProfile(profileResponse.data);

        // Fetch recent posts after profile data is set
        const postsResponse = await axiosReq.get(`/posts/?owner=${id}`); 
        console.log('Posts Response:', postsResponse.data); // Debugging: Print API response

        setRecentPosts(postsResponse.data.results || []); // Assuming posts are in data.results
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

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
          {recentPosts.length > 0 ? (
            <ul className="space-y-4">
              {recentPosts.map((post) => (
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
