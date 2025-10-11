import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Wait for authentication check to complete
  if (loading) {
    return <LoadingSpinner message="Verifying authentication..." />;
  }
  
  // Only redirect if loading is done AND user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // User is authenticated, show the protected content
  return children;
};

export default PrivateRoute;
