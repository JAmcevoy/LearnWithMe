import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import { useSidebar } from '../hooks/useSidebar';
import { useCurrentUser, useSetCurrentUser } from '../context/CurrentUserContext';
import LogoutModal from './LogoutModal';
import styles from '../styles/Sidebar.module.css'; // Importing the custom CSS

const Sidebar = ({ isOpen, isMobile }) => {
  const { isSidebarOpen, toggleSidebar, isMobileView, sidebarRef } = useSidebar(isOpen, isMobile);
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    console.log(currentUser); // Debug: check the currentUser object
  }, [currentUser]);

  const handleSignOut = async () => {
    try {
      await axios.post('dj-rest-auth/logout/');
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleLogoutConfirm = () => {
    handleSignOut();
    setIsLogoutModalOpen(false);
  };

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const handleModalClose = () => setIsLogoutModalOpen(false);

  const handleNavLinkClick = () => {
    if (isMobileView && isSidebarOpen) toggleSidebar();
  };

  const renderNavLink = (to, icon, label, extraClasses = '', condition = true) =>
    condition && (
      <li className={`flex items-center justify-center ${extraClasses}`}>
        <NavLink to={to} onClick={handleNavLinkClick} className="flex items-center text-white" aria-label={label}>
          {icon}
          <span className={`ml-4 ${styles.navText}`}>{label}</span> {/* Add class to control text visibility */}
        </NavLink>
      </li>
    );

  return (
    <>
      {isSidebarOpen && isMobileView && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-10"
          aria-label="Close sidebar overlay"
        />
      )}

      <div
        ref={sidebarRef}
        className={`bg-gray-800 p-4 transition-all duration-300 z-20 ${isMobileView
            ? 'fixed top-0 left-0 right-0 h-16 flex items-center justify-between'
            : `fixed top-0 right-0 h-screen ${isSidebarOpen ? 'w-64' : 'w-16'}`}`}
      >
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="text-white" aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
            <FaBars size={24} />
          </button>

          {isMobileView && isSidebarOpen && (
            <div className="flex space-x-4 ml-4">
              {renderNavLink('/', <FaHome size={24} />, 'Home')}
              {renderNavLink('/interest-circles', <FaUsers size={24} />, 'Interest Circles', '', currentUser)}
              {renderNavLink('/posts/create', <FaPlusCircle size={24} />, 'Create Post', '', currentUser)}
              {renderNavLink('/signin', <FaSignInAlt size={24} />, 'Sign In', '', !currentUser)}
              {renderNavLink('/signup', <FaUserPlus size={24} />, 'Sign Up', '', !currentUser)}
            </div>
          )}
        </div>

        {!isMobileView && (
          <div className="flex flex-col items-center mt-8 flex-grow">
            <div className="text-white flex flex-col items-center mb-8">
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

            <nav>
              <ul className="space-y-4">
                {renderNavLink('/', <FaHome size={24} />, 'Home')}
                {renderNavLink('/interest-circles', <FaUsers size={24} />, 'Interest Circles', '', currentUser)}
                {renderNavLink('/signin', <FaSignInAlt size={24} />, 'Sign In', '', !currentUser)}
                {renderNavLink('/signup', <FaUserPlus size={24} />, 'Sign Up', '', !currentUser)}
                {renderNavLink('/posts/create', <FaPlusCircle size={24} />, 'Create Post', '', currentUser)}
              </ul>
            </nav>
          </div>
        )}

        {currentUser && (
          <div className={`text-white ${isMobileView ? 'flex items-center space-x-4 ml-auto' : 'absolute bottom-4 left-0 right-0 flex justify-center items-center'}`}>
            {/* Render Profile Icon ONLY in Mobile View */}
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

            {/* Logout Button */}
            <button onClick={openLogoutModal} className="flex items-center" aria-label="Logout">
              <FaSignOutAlt size={24} />
              {!isMobileView && isSidebarOpen && <span className="ml-4">Logout</span>}
            </button>
          </div>
        )}
      </div>

      <LogoutModal isOpen={isLogoutModalOpen} onClose={handleModalClose} onConfirm={handleLogoutConfirm} />
    </>
  );
};

export default Sidebar;
