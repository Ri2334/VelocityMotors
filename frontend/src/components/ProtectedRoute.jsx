import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false, children }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
          <p className="text-brand-300 text-sm animate-pulse">Restoring session...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if user session is not active
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Gate check for administrator rights
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
