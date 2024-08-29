import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PostContent from './components/PostContent';
import InterestCircles from "./components/InterestCircles";
import Profile from "./components/Profile";
import Chats from "./components/Chats";
import { useSidebar } from './hooks/useSidebar';
import SignIn from './components/SignIn';

function App() {
  const { isSidebarOpen, toggleSidebar, isMobile } = useSidebar();

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
            <Route path="/chats/:id/" component={Chats} />
            <Route path="/Profile" exact component={Profile} />
            <Route path="/signin" exact component={SignIn} />
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
