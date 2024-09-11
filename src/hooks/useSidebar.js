import { useState, useEffect, useCallback, useRef } from 'react';

// Custom hook for managing sidebar state and behavior
export const useSidebar = (initialIsOpen, initialIsMobile) => {
  // State management for sidebar open/close
  const [isSidebarOpen, setIsSidebarOpen] = useState(initialIsOpen);
  
  // State management for mobile view
  const [isMobileView, setIsMobileView] = useState(initialIsMobile);
  
  // Reference to sidebar element for click outside detection
  const sidebarRef = useRef(null);

  // Memoized toggleSidebar function
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prevState => !prevState);
  }, []);

  // Handle window resize to update mobile view
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    const debouncedHandleResize = debounce(handleResize, 100);

    window.addEventListener('resize', debouncedHandleResize);
    handleResize(); // Initialize on mount

    return () => window.removeEventListener('resize', debouncedHandleResize);
  }, []);

  // Close sidebar when switching to mobile view
  useEffect(() => {
    if (isMobileView) setIsSidebarOpen(false);
  }, [isMobileView]);

  // Sync sidebar state with initial open state
  useEffect(() => {
    setIsSidebarOpen(initialIsOpen);
  }, [initialIsOpen]);

  // Handle clicks outside of the sidebar to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isSidebarOpen) {
        toggleSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen, toggleSidebar]);

  return {
    isSidebarOpen,
    toggleSidebar,
    isMobileView,
    sidebarRef,
  };
};

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
