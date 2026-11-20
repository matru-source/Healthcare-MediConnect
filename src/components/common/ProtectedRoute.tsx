import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // If doctor attempts to access hospital suite, grant clinical staff access
    if (role === 'doctor' && allowedRoles.includes('hospital_admin')) {
      return <>{children}</>;
    }
    // If not allowed, redirect to user's assigned portal
    if (role === 'hospital_admin') {
      return <Navigate to="/hospital/dashboard" replace />;
    }
    return <Navigate to="/patient/dashboard" replace />;
  }

  return <>{children}</>;
};
