import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PostContent from './components/PostContent';
import InterestCircles from "./components/InterestCircles"
import Profile from "./components/Profile"

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Toggle Sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  // Update mobile state on window resize
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  React.useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [isMobile]);

  return (
    <Router>
      <div className="bg-slate-400 min-h-screen flex">
        {/* Sidebar Component */}
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />

        {/* Main Content Area */}
        <main
          className={`transition-all duration-300 flex-grow ${isMobile && isSidebarOpen ? 'ml-64' : ''}`}
        >
          <Switch>
            <Route path="/" exact component={PostContent} />
            <Route path="/interest-circles" exact component={InterestCircles} />
            <Route path="/Profile" exact component={Profile} />
          </Switch>
        </main>

        {/* Overlay for Mobile Sidebar */}
        {isSidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-10"
            onClick={toggleSidebar}
          ></div>
        )}
      </div>
    </Router>
  );
}

export default App;
