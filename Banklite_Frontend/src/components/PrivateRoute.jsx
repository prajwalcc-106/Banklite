import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth.jsx';

const PrivateRoute = ({ children, requiredRole = null }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const userRole = localStorage.getItem('role');
    if (userRole !== requiredRole) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
