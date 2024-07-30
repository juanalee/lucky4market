import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../services/AuthContext';

const RoleProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, roles } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.includes(requiredRole)) {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default RoleProtectedRoute;
