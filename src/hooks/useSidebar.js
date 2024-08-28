import { useState, useEffect } from 'react';

export const useSidebar = (initialIsOpen = false, initialIsMobile = window.innerWidth <= 768) => {
  // State management for sidebar open/close
  const [isSidebarOpen, setIsSidebarOpen] = useState(initialIsOpen);
  // State management for mobile view
  const [isMobileView, setIsMobileView] = useState(initialIsMobile);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  useEffect(() => {
    // Handle window resize to update mobile view
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobileView) setIsSidebarOpen(false);
  }, [isMobileView]);

  useEffect(() => {
    setIsSidebarOpen(initialIsOpen);
  }, [initialIsOpen]);

  return { isSidebarOpen, toggleSidebar, isMobileView, setIsSidebarOpen };
};
