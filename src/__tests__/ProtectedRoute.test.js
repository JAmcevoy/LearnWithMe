import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Redirect } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute'; 
import { useCurrentUser } from '../context/CurrentUserContext'; 

// Mock the useCurrentUser hook
jest.mock('../context/CurrentUserContext');

describe('ProtectedRoute Component', () => {
  it('renders the component when the user is authenticated', () => {
    // Mock useCurrentUser to return a user (authenticated)
    useCurrentUser.mockReturnValue({ id: 1, name: 'John Doe' });

    // Mock Component to be rendered
    const MockComponent = () => <div>Mock Component</div>;

    // Render ProtectedRoute inside a MemoryRouter
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <ProtectedRoute path="/protected" component={MockComponent} />
      </MemoryRouter>
    );

    // Expect the MockComponent to be rendered
    expect(screen.getByText(/mock component/i)).toBeInTheDocument();
  });

  it('redirects to /signin when the user is not authenticated', () => {
    // Mock useCurrentUser to return null (not authenticated)
    useCurrentUser.mockReturnValue(null);

    // Render ProtectedRoute inside a MemoryRouter with a redirect route
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <ProtectedRoute path="/protected" component={() => <div>Protected Component</div>} />
        <Route path="/signin">
          <div>Signin Page</div>
        </Route>
      </MemoryRouter>
    );

    // Expect the Signin Page to be rendered
    expect(screen.getByText(/signin page/i)).toBeInTheDocument();
  });
});
