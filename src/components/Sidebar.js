import React, { useEffect, useRef, useState } from 'react';
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

function Sidebar({ isOpen, isMobile }) {
  const { isSidebarOpen, toggleSidebar, isMobileView } = useSidebar(isOpen, isMobile);
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const sidebarRef = useRef(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Handle user logout
  const handleSignOut = async () => {
    try {
      await axios.post('dj-rest-auth/logout/');
      setCurrentUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogoutConfirm = () => {
    handleSignOut();
    setIsLogoutModalOpen(false);
  };

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const handleModalClose = () => setIsLogoutModalOpen(false);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isSidebarOpen) {
        toggleSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen, toggleSidebar]);

  // Handle navigation link clicks
  const handleNavLinkClick = () => {
    if (isMobileView) {
      // Prevent sidebar from toggling open on mobile when clicking a link
      if (isSidebarOpen) {
        toggleSidebar();
      }
    }
  };

  const renderNavLink = (to, icon, label, extraClasses = '', condition = true) =>
    condition && (
      <li className={`flex items-center justify-center ${extraClasses}`}>
        <NavLink to={to} onClick={handleNavLinkClick} className="flex items-center text-white">
          {icon}
          {isSidebarOpen && <span className="ml-4">{label}</span>}
        </NavLink>
      </li>
    );

  return (
    <>
      {/* Mobile view overlay */}
      {isSidebarOpen && isMobileView && (
        <div onClick={toggleSidebar} className="fixed inset-0 bg-black opacity-50 z-10" />
      )}

      <div
        ref={sidebarRef}
        className={`bg-gray-800 p-4 transition-all duration-300 z-20 ${
          isMobileView
            ? 'fixed top-0 left-0 right-0 h-16 flex items-center justify-between'
            : `fixed top-0 right-0 h-screen ${isSidebarOpen ? 'w-64' : 'w-16'}`
        }`}
      >
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="text-white">
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

        {/* Sidebar Content */}
        <div className="flex flex-col items-center mt-8 flex-grow">
          {!isMobileView && (
            <>
              {/* User Info */}
              <div className="text-white flex flex-col items-center mb-8">
                {currentUser ? (
                  <>
                    <NavLink to={`/profile/${currentUser.pk}`} className="text-white">
                      <FaUserCircle size={isSidebarOpen ? 80 : 40} className="mb-4" />
                    </NavLink>
                    {isSidebarOpen && <p className="text-center">{currentUser.username}</p>}
                  </>
                ) : (
                  <p className="text-center">Please Log In</p>
                )}
              </div>

              {/* Navigation Links */}
              <nav>
                <ul className="space-y-4">
                  {renderNavLink('/', <FaHome size={24} />, 'Home')}
                  {renderNavLink('/interest-circles', <FaUsers size={24} />, 'Interest Circles', '', currentUser)}
                  {renderNavLink('/signin', <FaSignInAlt size={24} />, 'Sign In', '', !currentUser)}
                  {renderNavLink('/signup', <FaUserPlus size={24} />, 'Sign Up', '', !currentUser)}
                  {renderNavLink('/posts/create', <FaPlusCircle size={24} />, 'Create Post', '', currentUser)}
                </ul>
              </nav>
            </>
          )}
        </div>

        {/* Logout Button */}
        {currentUser && (
          <div className={`text-white ${isMobileView ? '' : 'absolute bottom-4 left-0 right-0'} flex justify-center items-center`}>
            <button onClick={openLogoutModal} className="flex items-center">
              <FaSignOutAlt size={24} />
              {!isMobileView && isSidebarOpen && <span className="ml-4">Logout</span>}
            </button>
          </div>
        )}
      </div>

      {/* Logout Modal */}
      <LogoutModal isOpen={isLogoutModalOpen} onClose={handleModalClose} onConfirm={handleLogoutConfirm} />
    </>
  );
}

export default Sidebar;
