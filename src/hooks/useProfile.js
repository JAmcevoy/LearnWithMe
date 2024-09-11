import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { axiosReq } from '../api/axiosDefaults';
import { useCurrentUser } from "../context/CurrentUserContext";

const useProfile = () => {
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
        const profileResponse = await axiosReq.get(`/profiles/${id}/`);
        setProfile(profileResponse.data);

        setIsFollowing(profileResponse.data.following_id);

        const postsResponse = await axiosReq.get(`/posts/`);
        setAllPosts(postsResponse.data.results || []);

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
    if (profile) {
      setFilteredPosts(allPosts.filter(post => post.owner_profile_id === profile.id));
    }
  }, [profile, allPosts]);

  useEffect(() => {
    if (profile) {
      setFilteredLikedPosts(allLikedPosts.filter(like => like.owner_profile_id === profile.id));
    }
  }, [profile, allLikedPosts]);

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
    formatSteps,
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
