import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  // If there's a token, render the child components (e.g., the Dashboard).
  // The <Outlet /> component is a placeholder for the actual route component.
  // If there's no token, redirect the user to the login page.
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
