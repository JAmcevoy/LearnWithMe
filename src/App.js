import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import PostContent from "./components/PostContent";
import Profile from "./components/Profile";
import InterestCircles from "./components/InterestCircles";
import Chats from "./components/Chats";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="bg-slate-400 min-h-screen flex">
      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 flex-grow ${isSidebarOpen && !isMobile ? "ml-20" : "ml-6"}`}
      >
        {/* <PostContent /> */}
        {/* <Profile /> */}
        {/* <InterestCircles /> */}
        <Chats />
      </div>

      {/* Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobile={isMobile}
      />

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default App;
