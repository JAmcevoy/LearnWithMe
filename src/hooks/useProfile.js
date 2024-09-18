import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { axiosReq } from '../api/axiosDefaults';
import { useCurrentUser } from '../context/CurrentUserContext';

const useProfile = () => {
  const { id } = useParams();
  const history = useHistory();
  const currentUser = useCurrentUser();

  // State for profile data, posts, liked posts, loading state, and errors
  const [profile, setProfile] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [allLikedPosts, setAllLikedPosts] = useState([]);
  const [filteredLikedPosts, setFilteredLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Fetch profile data, posts, and likes on mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileResponse, postsResponse, likedPostsResponse] = await Promise.all([
          axiosReq.get(`/profiles/${id}/`),
          axiosReq.get(`/posts/`),
          axiosReq.get(`/likes/`),
        ]);

        const profileData = profileResponse.data;
        setProfile(profileData);
        setIsFollowing(!!profileData.following_id); // Set following status based on fetched profile data

        // Populate posts and liked posts from responses
        setAllPosts(postsResponse.data.results || []);
        setAllLikedPosts(likedPostsResponse.data.results || []);
      } catch (err) {
        handleError(`Error fetching profile data: ${getErrorMessage(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  // Filter posts by the profile's ID
  useEffect(() => {
    if (profile) {
      setFilteredPosts(allPosts.filter(post => post.owner_profile_id === profile.id));
    }
  }, [profile, allPosts]);

  // Filter liked posts by the profile's ID
  useEffect(() => {
    if (profile) {
      setFilteredLikedPosts(allLikedPosts.filter(like => like.owner_profile_id === profile.id));
    }
  }, [profile, allLikedPosts]);

  // Handle following/unfollowing a profile
  const handleFollow = async () => {
    try {
      if (isFollowing) {
        // Unfollow logic
        await axiosReq.delete(`/followers/${profile.following_id}/`);
        updateFollowersCount(-1);
        setIsFollowing(false);
      } else {
        // Follow logic
        await axiosReq.post(`/followers/`, {
          owner: currentUser.pk,
          followed: id,
        });
        updateFollowersCount(1);
        setIsFollowing(true);
      }
    } catch (err) {
      handleError(`Error following/unfollowing: ${getErrorMessage(err)}`);
    }
  };
  

  // Helper to update the follower count
  const updateFollowersCount = (change) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      followers_count: prevProfile.followers_count + change,
    }));
  };

  // Navigate to profile edit page
  const handleEditProfile = () => {
    history.push(`/profiles/${id}/edit`);
  };

  // Handle and display errors
  const handleError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  // Helper function to extract and return error message
  const getErrorMessage = (err) => {
    return err.response?.data || err.message || 'An error occurred';
  };

  return {
    profile,
    allPosts,
    filteredPosts,
    allLikedPosts,
    filteredLikedPosts,
    loading,
    isFollowing,
    errorMessage,
    showErrorModal,
    handleFollow,
    handleEditProfile,
    setProfile,
    setAllPosts,
    setAllLikedPosts,
    setFilteredPosts,
    setFilteredLikedPosts,
    setLoading,
    setIsFollowing,
    setErrorMessage,
    setShowErrorModal,
  };
};

export default useProfile;
