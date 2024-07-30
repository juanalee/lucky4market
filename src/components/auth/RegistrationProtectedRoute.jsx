import React, { useContext, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { RegistrationContext } from '../../services/RegistrationContext';

const RegistrationProtectedRoute = ({ additionalCheck }) => {
  const { isPreRegistered, isRegistered } = useContext(RegistrationContext);

  useEffect(() => {
    console.log('RegistrationProtectedRoute check:', { additionalCheck, isPreRegistered, isRegistered });
  }, [additionalCheck, isPreRegistered, isRegistered]);

  if (additionalCheck === 'preRegistered' && !isPreRegistered) {
    console.log('Redirecting to /register because pre-registration is not complete');
    return <Navigate to="/register" replace />;
  }

  if (additionalCheck === 'registered' && !isRegistered) {
    console.log('Redirecting to /registerMember because registration is not complete');
    return <Navigate to="/registerMember" replace />;
  }

  return <Outlet />;
};

export default RegistrationProtectedRoute;
