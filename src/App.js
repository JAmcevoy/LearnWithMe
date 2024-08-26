import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";

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
        {/* Placeholder for where your main content would go */}
        <div className="text-white text-center mt-10">
          <h1>Main Content Area</h1>
          <p>This is where the posts will be displayed.</p>
        </div>
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
