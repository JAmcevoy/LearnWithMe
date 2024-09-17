import { useState } from 'react';
import {
  FaUserCircle,
  FaHome,
  FaUsers,
  FaBars,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaPlusCircle,
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import useSidebar from '../hooks/useSidebar';
import { useCurrentUser, useSetCurrentUser } from '../context/CurrentUserContext';
import LogoutModal from './LogoutModal';
import styles from '../styles/Sidebar.module.css';

const Sidebar = ({ isOpen = false, isMobile = false }) => {
  // Manage sidebar open/close and mobile view states using the custom hook
  const { isSidebarOpen, toggleSidebar, isMobileView, sidebarRef } = useSidebar(isOpen, isMobile);

  const currentUser = useCurrentUser(); // Get the current user
  const setCurrentUser = useSetCurrentUser(); // Setter to update the current user state
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Modal state for logout confirmation

  // Handle user sign out
  const handleSignOut = async () => {
    try {
      await axios.post('dj-rest-auth/logout/'); // API call to log out the user
      setCurrentUser(null); // Reset current user state
    } catch (err) {
      console.error('Logout error:', err); // Log any errors during sign out
    }
  };

  // Confirm logout action
  const handleLogoutConfirm = () => {
    handleSignOut();
    setIsLogoutModalOpen(false); // Close the modal after logout
  };

  const openLogoutModal = () => setIsLogoutModalOpen(true); // Open the logout modal
  const handleModalClose = () => setIsLogoutModalOpen(false); // Close the logout modal

  // Close the sidebar when a navigation link is clicked (only in mobile view)
  const handleNavLinkClick = () => {
    if (isMobileView && isSidebarOpen) toggleSidebar();
  };

  // Utility function to render navigation links conditionally
  const renderNavLink = (to, icon, label, condition = true) =>
    condition && (
      <li className="navItem flex items-center justify-center">
        <NavLink
          to={to}
          onClick={handleNavLinkClick}
          className="flex items-center text-white"
          aria-label={label}
        >
          {icon}
          {isSidebarOpen && <span className={`ml-4 ${styles.navText}`}>{label}</span>}
        </NavLink>
      </li>
    );

  return (
    <>
      {/* Overlay for mobile view when sidebar is open */}
      {isSidebarOpen && isMobileView && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-10"
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Sidebar container */}
      <div
        ref={sidebarRef}
        className={`bg-gray-800 p-4 transition-all duration-300 z-20 ${isMobileView
          ? 'fixed top-0 left-0 right-0 h-16 flex items-center justify-between'
          : `fixed top-0 right-0 h-screen ${isSidebarOpen ? 'w-64 sidebarOpen' : 'w-16 sidebarClosed'}`}`}
      >
        {/* Sidebar toggle button */}
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="text-white" aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
            <FaBars size={24} />
          </button>

          {/* Mobile view links when sidebar is open */}
          {isMobileView && isSidebarOpen && (
            <div className="flex space-x-4 ml-4">
              {renderNavLink('/', <FaHome size={24} />, 'Home')}
              {renderNavLink('/interest-circles', <FaUsers size={24} />, 'Interest Circles', currentUser)}
              {renderNavLink('/posts/create', <FaPlusCircle size={24} />, 'Create Post', currentUser)}
              {renderNavLink('/signin', <FaSignInAlt size={24} />, 'Sign In', !currentUser)}
              {renderNavLink('/signup', <FaUserPlus size={24} />, 'Sign Up', !currentUser)}
            </div>
          )}
        </div>

        {/* Desktop view sidebar content */}
        {!isMobileView && (
          <div className="flex flex-col items-center mt-8 flex-grow">
            <div className="text-white flex flex-col items-center mb-8">
              {/* User profile image or icon */}
              {currentUser ? (
                <>
                  <NavLink
                    to={`/profile/${currentUser.pk}`}
                    className="text-white"
                    aria-label={`Profile of ${currentUser.username}`}
                  >
                    {currentUser.profile_image ? (
                      <img
                        src={currentUser.profile_image}
                        alt={`${currentUser.username}'s profile`}
                        className={`rounded-full ${isSidebarOpen ? 'w-20 h-20' : 'w-8 h-8'}`}
                      />
                    ) : (
                      <FaUserCircle size={isSidebarOpen ? 80 : 80} className="mb-4" />
                    )}
                  </NavLink>
                  {isSidebarOpen && <p className="text-center">{currentUser.username}</p>}
                </>
              ) : (
                <p className="text-center">Please Log In</p>
              )}
            </div>

            {/* Navigation links */}
            <nav>
              <ul className="space-y-4">
                {renderNavLink('/', <FaHome size={24} />, 'Home')}
                {renderNavLink('/interest-circles', <FaUsers size={24} />, 'Interest Circles', currentUser)}
                {renderNavLink('/signin', <FaSignInAlt size={24} />, 'Sign In', !currentUser)}
                {renderNavLink('/signup', <FaUserPlus size={24} />, 'Sign Up', !currentUser)}
                {renderNavLink('/posts/create', <FaPlusCircle size={24} />, 'Create Post', currentUser)}
              </ul>
            </nav>
          </div>
        )}

        {/* Logout button */}
        {currentUser && (
          <div className={`text-white ${isMobileView ? 'flex items-center space-x-4 ml-auto' : 'absolute bottom-4 left-0 right-0 flex justify-center items-center'}`}>
            {/* Mobile profile link */}
            {isMobileView && (
              <NavLink to={`/profile/${currentUser.pk}`} aria-label="User Profile">
                {currentUser.profile_image ? (
                  <img
                    src={currentUser.profile_image}
                    alt={`${currentUser.username}'s profile`}
                    className="rounded-full w-8 h-8"
                  />
                ) : (
                  <FaUserCircle size={24} />
                )}
              </NavLink>
            )}

            {/* Logout button */}
            <button onClick={openLogoutModal} className="flex items-center" aria-label="Logout">
              <FaSignOutAlt size={24} />
              {!isMobileView && isSidebarOpen && <span className="ml-4">Logout</span>}
            </button>
          </div>
        )}
      </div>

      {/* Logout confirmation modal */}
      <LogoutModal isOpen={isLogoutModalOpen} onClose={handleModalClose} onConfirm={handleLogoutConfirm} />
    </>
  );
};

export default Sidebar;
