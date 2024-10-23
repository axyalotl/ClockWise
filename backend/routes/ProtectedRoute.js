// ProtectedRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { auth } from './firebaseConfig';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        auth.currentUser ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;
