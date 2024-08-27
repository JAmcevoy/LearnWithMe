import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaHome, FaUsers, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

function Sidebar({ isOpen, toggleSidebar, isMobile }) {
  // Local state and effect for sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(isOpen);
  const [isMobileView, setIsMobileView] = useState(isMobile);

  useEffect(() => {
    // Handle window resize to update mobile view
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobileView) setIsSidebarOpen(false);
  }, [isMobileView]);

  useEffect(() => {
    setIsSidebarOpen(isOpen);
  }, [isOpen]);

  // Toggle sidebar visibility
  const handleToggle = () => {
    setIsSidebarOpen(prevState => !prevState);
    toggleSidebar(); // Prop function to sync with parent
  };

  return (
    <div
      className={`bg-gray-800 p-4 transition-all duration-300 z-20 ${
        isMobileView
          ? 'fixed top-0 left-0 right-0 h-16 flex items-center justify-between'
          : `fixed top-0 right-0 h-screen ${isSidebarOpen ? 'w-64' : 'w-16'}`
      }`}
    >
      {/* Sidebar Toggle and Mobile Links */}
      <div className="flex items-center">
        <button onClick={handleToggle} className="text-white">
          <FaBars size={24} />
        </button>
        {isMobileView && isSidebarOpen && (
          <div className="flex space-x-4 ml-4">
            <NavLink to="/" onClick={handleToggle}>
              <FaHome size={24} />
            </NavLink>
            <NavLink to="/interest-circles" onClick={handleToggle}>
              <FaUsers size={24} />
            </NavLink>
          </div>
        )}
      </div>

      {/* Profile and Links for Desktop */}
      <div className="flex flex-col items-center mt-8 flex-grow">
        {!isMobileView && (
          <>
            <div className="text-white flex flex-col items-center mb-8">
              <FaUserCircle
                size={isSidebarOpen ? 80 : 40}
                className="text-white mb-4"
              />
              {isSidebarOpen && <p className="text-white text-center">John Doe</p>}
            </div>
            <nav>
              <ul className="space-y-4">
                <li className="flex items-center justify-center">
                  <NavLink
                    to="/"
                    className="flex items-center text-white"
                    activeClassName="font-bold"
                  >
                    <FaHome size={24} />
                    {isSidebarOpen && <span className="ml-4">Feed</span>}
                  </NavLink>
                </li>
                <li className="flex items-center justify-center">
                  <NavLink
                    to="/interest-circles"
                    className="flex items-center text-white"
                    activeClassName="font-bold"
                  >
                    <FaUsers size={24} />
                    {isSidebarOpen && <span className="ml-4">Interest Circles</span>}
                  </NavLink>
                </li>
              </ul>
            </nav>
          </>
        )}
      </div>

      {/* Logout Button */}
      <div
        className={`${
          isMobileView
            ? 'text-white'
            : 'absolute bottom-4 left-0 right-0 text-white'
        } flex justify-center items-center`}
      >
        <NavLink
          to="/"
          className="flex items-center text-white"
          onClick={() => {
            // Add your logout logic here
            console.log('Logging out');
          }}
        >
          <FaSignOutAlt size={24} />
          {!isMobileView && isSidebarOpen && <span className="ml-4">Logout</span>}
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
