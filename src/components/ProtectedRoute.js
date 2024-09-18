import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useCurrentUser } from '../context/CurrentUserContext';

/**
 * ProtectedRoute component that restricts access to authenticated users.
 *
 * If a user is logged in (`currentUser` is present), the specified component
 * will be rendered. Otherwise, the user will be redirected to the login page.
 */
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const currentUser = useCurrentUser(); // Get the current user from context

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
