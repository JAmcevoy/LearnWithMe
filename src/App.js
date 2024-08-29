import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PostContent from './pages/Posts/PostContent';
import InterestCircles from "./pages/Circles/InterestCircles";
import Profile from "./pages/User/Profile";
import Chats from "./pages/Circles/Chats";
import { useSidebar } from './hooks/useSidebar';
import SignIn from './pages/User/SignIn';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import SignUp from './pages/User/SignUp';
import PostDetails from './pages/Posts/PostDetails';

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
            <Route path="/posts/:id" exact component={PostDetails} />
            <ProtectedRoute path="/chats" component={Chats} />
            <ProtectedRoute path="/interest-circles" component={InterestCircles} />
            <Route path="/Profile" exact component={Profile} />
            <Route path="/signin" exact component={SignIn} />
            <Route path="/signup" exact component={SignUp} />
            <Route component={NotFound} />
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
