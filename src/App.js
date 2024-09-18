import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PostContent from './pages/posts/PostList';
import InterestCircles from './pages/circles/InterestCircles';
import InterestCircleCreation from './pages/circles/InterestCircleCreation';
import Profile from './pages/profiles/Profile';
import Chats from './pages/circles/Chats';
import SignIn from './pages/authentication/SignIn';
import NotFound from './pages/NotFound';
import SignUp from './pages/authentication/SignUp';
import PostCreation from './pages/posts/PostCreation';
import PostEdit from './pages/posts/PostEdit';
import ProfileEdit from './pages/profiles/ProfileEdit';
import PostDetails from './pages/posts/PostDetails';
import ProtectedRoute from './components/ProtectedRoute'; 
import BackButton from './components/BackButton';

function App() {
    return (
        <Router>
            <div className="bg-slate-400 min-h-screen flex">
                <Sidebar />
                <BackButton />

                <main className="transition-all duration-300 flex-grow">
                    <h1 className='hidden'>Learn with me</h1> 
                    <Switch>
                        <Route path="/" exact component={PostContent} />
                        <Route path="/signin" exact component={SignIn} />
                        <Route path="/signup" exact component={SignUp} />
                        <ProtectedRoute path="/posts/create" exact component={PostCreation} />
                        <ProtectedRoute path="/posts/edit/:id" exact component={PostEdit} />
                        <ProtectedRoute path="/interest-circles/create" exact component={InterestCircleCreation} />
                        <ProtectedRoute path="/interest-circles/:id/chats" exact component={Chats} />
                        <ProtectedRoute path="/interest-circles" exact component={InterestCircles} />
                        <ProtectedRoute path="/profile/:id" exact component={Profile} />
                        <ProtectedRoute path="/profiles/:id/edit" exact component={ProfileEdit} />
                        <Route path="/posts/:id" exact component={PostDetails} />
                        <Route component={NotFound} />
                    </Switch>
                </main>
            </div>
        </Router>
    );
}

export default App;