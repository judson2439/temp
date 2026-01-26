import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  
  // Check if session exists in localStorage
  const session = localStorage.getItem('session');
  
  if (!session) {
    // Redirect to login page, but save the attempted URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Verify session is valid JSON
  try {
    const parsedSession = JSON.parse(session);
    if (!parsedSession || !parsedSession.user) {
      localStorage.removeItem('session');
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
  } catch (e) {
    localStorage.removeItem('session');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
