import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PostContent from './pages/Posts/PostList';
import InterestCircles from './pages/Circles/InterestCircles';
import InterestCircleCreation from './pages/Circles/InterestCircleCreation';
import Profile from './pages/Profiles/Profile';
import Chats from './pages/Circles/Chats';
import SignIn from './pages/Authentication/SignIn';
import NotFound from './pages/NotFound';
import SignUp from './pages/Authentication/SignUp';
import PostCreation from './pages/Posts/PostCreation';
import PostEdit from './pages/Posts/PostEdit';
import ProfileEdit from './pages/Profiles/ProfileEdit';
import PostDetails from './pages/Posts/PostDetails';
import ProtectedRoute from './components/ProtectedRoute'; 
import BackButton from './components/BackButton';

function App() {
    return (
        <Router>
            <div className="bg-slate-400 min-h-screen flex">
                <Sidebar />
                <BackButton />

                <main className="transition-all duration-300 flex-grow">
                    <Switch>
                        <Route path="/" exact component={PostContent} />
                        <Route path="/signin" exact component={SignIn} />
                        <Route path="/signup" exact component={SignUp} />

                        {/* Protected Routes */}
                        <ProtectedRoute path="/posts/create" exact component={PostCreation} />
                        <ProtectedRoute path="/posts/edit/:id" exact component={PostEdit} />
                        <ProtectedRoute path="/interest-circles/create" exact component={InterestCircleCreation} />
                        <ProtectedRoute path="/interest-circles/:id/chats" exact component={Chats} />
                        <ProtectedRoute path="/interest-circles" exact component={InterestCircles} />
                        <ProtectedRoute path="/profile/:id" exact component={Profile} />
                        <ProtectedRoute path="/profiles/:id/edit" exact component={ProfileEdit} />

                        <Route path="/posts/:id" exact component={PostDetails} />

                        {/* Catch-all for 404 Not Found */}
                        <Route component={NotFound} />
                    </Switch>
                </main>
            </div>
        </Router>
    );
}

export default App;
