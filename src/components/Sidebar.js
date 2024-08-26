import React from "react";
import {
  FaUserCircle,
  FaHome,
  FaUsers,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar({ isOpen, toggleSidebar, isMobile }) {
  return (
    <div
      className={`bg-gray-800 p-4 transition-all duration-300 z-20 ${
        isMobile
          ? "fixed top-0 left-0 right-0 h-16 flex items-center justify-between"
          : `fixed top-0 right-0 h-screen ${isOpen ? "w-64" : "w-16"}`
      }`}
    >
      {/* Sidebar Toggle and Mobile Links */}
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-white">
          <FaBars size={24} />
        </button>
        {isMobile && isOpen && (
          <div className="flex space-x-4 ml-4">
            <div className="text-white">
              <FaHome size={24} />
            </div>
            <div className="text-white">
              <FaUsers size={24} />
            </div>
          </div>
        )}
      </div>

      {/* Profile and Links for Desktop */}
      <div className="flex flex-col items-center mt-8 flex-grow">
        {!isMobile && (
          <>
            <div className="text-white flex flex-col items-center mb-8">
              <FaUserCircle
                size={isOpen ? 80 : 40}
                className="text-white mb-4"
              />
              {isOpen && <p className="text-white text-center">John Doe</p>}
            </div>
            <nav>
              <ul className="space-y-4">
                <li className="flex items-center justify-center">
                  <div className="text-white flex items-center">
                    <FaHome size={24} />
                    {isOpen && <span className="ml-4">Feed</span>}
                  </div>
                </li>
                <li className="flex items-center justify-center">
                  <div className="text-white flex items-center">
                    <FaUsers size={24} />
                    {isOpen && <span className="ml-4">Interest Circles</span>}
                  </div>
                </li>
              </ul>
            </nav>
          </>
        )}
      </div>

      {/* Logout Button */}
      <div
        className={`${
          isMobile
            ? "text-white"
            : "absolute bottom-4 left-0 right-0 text-white"
        } flex justify-center items-center`}
      >
        <FaSignOutAlt size={24} className="text-white" />
        {!isMobile && isOpen && <span className="ml-4">Logout</span>}
      </div>
    </div>
  );
}

export default Sidebar;
