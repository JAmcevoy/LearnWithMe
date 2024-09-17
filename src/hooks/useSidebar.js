import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Debounce utility function to delay frequent executions of a function.
 */
const debounce = (func) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), 1000); // 1 second (1000 ms)
  };
};


/**
 * Custom hook to manage sidebar visibility and mobile responsiveness.
 */
const useSidebar = (initialIsOpen = false, initialIsMobile = false) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(initialIsOpen); // Sidebar open/closed state
  const [isMobileView, setIsMobileView] = useState(initialIsMobile); // Mobile view state
  const sidebarRef = useRef(null); // Reference to the sidebar DOM element

  /**
   * Toggles the sidebar open/closed state.
   */
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prevState => !prevState);
  }, []);

  /**
   * Handles window resize events and updates mobile view state accordingly.
   */
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setIsMobileView(isMobile);
    };

    // Debounce the resize handler to avoid unnecessary re-renders
    const debouncedHandleResize = debounce(handleResize, 100);

    // Attach the resize event listener
    window.addEventListener('resize', debouncedHandleResize);
    
    // Initialize the mobile view state on mount
    handleResize();

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', debouncedHandleResize);
  }, []);

  /**
   * Closes the sidebar when switching to mobile view.
   */
  useEffect(() => {
    if (isMobileView) {
      setIsSidebarOpen(false);
    }
  }, [isMobileView]);

  /**
   * Closes the sidebar if a click occurs outside of the sidebar element.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isSidebarOpen) {
        toggleSidebar();
      }
    };

    // Attach the click event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen, toggleSidebar]);

  return {
    isSidebarOpen,
    toggleSidebar,
    isMobileView,
    sidebarRef, // Ref to be assigned to the sidebar element
  };
};

export default useSidebar;
