import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from  'prop-types';

const GuardedRoute = ({ component: Component, loggedUser, ...rest }) => (
  <Route
    {...rest} render={(props) => (
        loggedUser.role === 'Admin' 
            ? <Component {...props} />
            : <Redirect to='/home' />
    )}
  />
);

GuardedRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default GuardedRoute;
