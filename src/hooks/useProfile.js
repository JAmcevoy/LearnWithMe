import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { axiosReq } from '../api/axiosDefaults';
import { useCurrentUser } from '../context/CurrentUserContext';

const useProfile = () => {
  const { id } = useParams();
  const history = useHistory();
  const currentUser = useCurrentUser();

  const [profile, setProfile] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [allLikedPosts, setAllLikedPosts] = useState([]);
  const [filteredLikedPosts, setFilteredLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Fetch profile data and posts on component mount
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
        setIsFollowing(!!profileData.following_id);

        setAllPosts(postsResponse.data.results || []);
        setAllLikedPosts(likedPostsResponse.data.results || []);
      } catch (err) {
        const message = err.response ? err.response.data : err.message;
        setErrorMessage(`Error fetching profile data: ${message}`);
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  // Filter posts by profile ID
  useEffect(() => {
    if (profile) {
      setFilteredPosts(allPosts.filter(post => post.owner_profile_id === profile.id));
    }
  }, [profile, allPosts]);

  // Filter liked posts by profile ID
  useEffect(() => {
    if (profile) {
      setFilteredLikedPosts(allLikedPosts.filter(like => like.owner_profile_id === profile.id));
    }
  }, [profile, allLikedPosts]);

  // Handle follow/unfollow action
  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axiosReq.delete(`/followers/${profile.following_id}/`);
        setIsFollowing(false);
        setProfile(prevProfile => ({
          ...prevProfile,
          followers_count: prevProfile.followers_count - 1,
        }));
      } else {
        const { data } = await axiosReq.post(`/followers/`, {
          owner: currentUser.pk,
          followed: id,
        });
        setIsFollowing(true);
        setProfile(prevProfile => ({
          ...prevProfile,
          followers_count: prevProfile.followers_count + 1,
        }));
      }
    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      setErrorMessage(`Error following/unfollowing: ${message}`);
      setShowErrorModal(true);
    }
  };

  // Navigate to profile edit page
  const handleEditProfile = () => {
    history.push(`/profiles/${id}/edit`);
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
