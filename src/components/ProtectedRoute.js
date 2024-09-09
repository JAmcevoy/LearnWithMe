import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useCurrentUser } from '../context/CurrentUserContext.js';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const currentUser = useCurrentUser();

    return (
        <Route
            {...rest}
            render={(props) =>
                currentUser ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/signin" />
                )
            }
        />
    );
};

export default ProtectedRoute;
