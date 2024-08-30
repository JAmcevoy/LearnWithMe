import React from 'react';
import axios from 'axios';
import { FaUserCircle, FaHome, FaUsers, FaBars, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaPlusCircle } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../hooks/useSidebar';
import { useCurrentUser, useSetCurrentUser } from '../context/CurrentUserContext.js';

function Sidebar({ isOpen, isMobile }) {
    const { isSidebarOpen, toggleSidebar: handleToggle, isMobileView } = useSidebar(isOpen, isMobile);
    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();

    const handleSignOut = async () => {
        try{
            await axios.post("dj-rest-auth/logout/");
            setCurrentUser(null);
          }catch(err){
            console.log(err);
          }
        };

    return (
        <div
            className={`bg-gray-800 p-4 transition-all duration-300 z-20 ${
                isMobileView
                    ? 'fixed top-0 left-0 right-0 h-16 flex items-center justify-between'
                    : `fixed top-0 right-0 h-screen ${isSidebarOpen ? 'w-64' : 'w-16'}`
            }`}
        >
            <div className="flex items-center">
                <button onClick={handleToggle} className="text-white">
                    <FaBars size={24} />
                </button>
                {isMobileView && isSidebarOpen && (
                    <div className="flex space-x-4 ml-4">
                        <NavLink to="/" onClick={handleToggle} className="text-white">
                            <FaHome size={24} />
                        </NavLink>
                        {currentUser && (
                            <NavLink to="/interest-circles" onClick={handleToggle} className="text-white">
                                <FaUsers size={24} />
                            </NavLink>
                        )}
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center mt-8 flex-grow">
                {!isMobileView && (
                    <>
                        <div className="text-white flex flex-col items-center mb-8">
                            {currentUser ? (
                                <>
                                    <NavLink to={`/profile/${currentUser.pk}`} className="text-white">
                                        <FaUserCircle
                                            size={isSidebarOpen ? 80 : 40}
                                            className="text-white mb-4"
                                        />
                                    </NavLink>
                                    {isSidebarOpen && <p className="text-white text-center">{currentUser.username}</p>}
                                </>
                            ) : (
                                <p className="text-white text-center">Please Log In</p>
                            )}
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
                                        {isSidebarOpen && <span className="ml-4">Home</span>}
                                    </NavLink>
                                </li>
                                {currentUser && (
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
                                )}
                                {!currentUser && (
                                    <>
                                        <li className="flex items-center justify-center">
                                            <NavLink
                                                to="/signin"
                                                className="flex items-center text-white"
                                                activeClassName="font-bold"
                                            >
                                                <FaSignInAlt size={24} />
                                                {isSidebarOpen && <span className="ml-4">Sign In</span>}
                                            </NavLink>
                                        </li>
                                        <li className="flex items-center justify-center">
                                            <NavLink
                                                to="/signup"
                                                className="flex items-center text-white"
                                                activeClassName="font-bold"
                                            >
                                                <FaUserPlus size={24} />
                                                {isSidebarOpen && <span className="ml-4">Sign Up</span>}
                                            </NavLink>
                                        </li>
                                    </>
                                )}
                                {currentUser && (
                                    <li className="flex items-center justify-center">
                                        <NavLink
                                            to="/post/create"
                                            className="flex items-center text-white"
                                            activeClassName="font-bold"
                                        >
                                            <FaPlusCircle size={24} />
                                            {isSidebarOpen && <span className="ml-4">Create Post</span>}
                                        </NavLink>
                                    </li>
                                )}
                            </ul>
                        </nav>
                    </>
                )}
            </div>

            {currentUser && (
                <div
                    className={`${
                        isMobileView
                            ? 'text-white'
                            : 'absolute bottom-4 left-0 right-0 text-white'
                    } flex justify-center items-center`}
                >
                    <button
                        className="flex items-center text-white"
                        onClick={handleSignOut}
                    >
                        <FaSignOutAlt size={24} />
                        {!isMobileView && isSidebarOpen && <span className="ml-4">Logout</span>}
                    </button>
                </div>
            )}
        </div>
    );
}

export default Sidebar;
