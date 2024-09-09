import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useCurrentUser } from './context/CurrentUserContext';
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

function App() {
    
    const currentUser = useCurrentUser();
    const loggedIn = !!currentUser;


    return (
        <Router>
            <div className="bg-slate-400 min-h-screen flex">
                {/* Sidebar Component */}
                <Sidebar />

                {/* Main Content Area */}
                <main className={`transition-all duration-300 flex-grow`}>
                    <Switch>
                        {/* Public Routes */}
                        <Route path="/" exact component={PostContent} />
                        <Route path="/signin" exact component={SignIn} />
                        <Route path="/signup" exact component={SignUp} />

                        {/* Private Routes */}
                        <Route path="/posts/create" exact>
                            {loggedIn ? <PostCreation /> : <Redirect to="/signin" />}
                        </Route>
                        <Route path="/posts/:id" exact component={PostDetails} />
                        <Route path="/posts/edit/:id" exact>
                            {loggedIn ? <PostEdit /> : <Redirect to="/signin" />}
                        </Route>

                        <Route path="/interest-circles/create" exact>
                            {loggedIn ? <InterestCircleCreation /> : <Redirect to="/signin" />}
                        </Route>
                        <Route path="/interest-circles/:id/chats" exact>
                            {loggedIn ? <Chats /> : <Redirect to="/signin" />}
                        </Route>
                        <Route path="/interest-circles" exact>
                            {loggedIn ? <InterestCircles /> : <Redirect to="/signin" />}
                        </Route>
                        
                        <Route path="/profile/:id" exact>
                            {loggedIn ? <Profile /> : <Redirect to="/signin" />}
                        </Route>
                        <Route path="/profiles/:id/edit" exact>
                            {loggedIn ? <ProfileEdit /> : <Redirect to="/signin" />}
                        </Route>

                        {/* Catch-all for 404 Not Found */}
                        <Route component={NotFound} />
                    </Switch>
                </main>
            </div>
        </Router>
    );
}

export default App;
