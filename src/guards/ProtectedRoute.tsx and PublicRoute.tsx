import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

// ProtectedRoute: Only allow authenticated users
interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return fallback || <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect to login with the current location as the return URL
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// PublicRoute: Only allow unauthenticated users (redirect authenticated users)
interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function PublicRoute({ children, redirectTo = '/dashboard', fallback }: PublicRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return fallback || <LoadingSpinner />;
  }

  if (isAuthenticated) {
    // Redirect authenticated users away from public-only routes
    const from = location.state?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}

// Optional: RequireRole component for role-based access control
interface RequireRoleProps {
  children: React.ReactNode;
  role: string;
  fallback?: React.ReactNode;
}

export function RequireRole({ children, role, fallback }: RequireRoleProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return fallback || <LoadingSpinner />;
  }

  // Check if user has the required role (you'll need to implement role checking logic)
  const userRole = user?.user_metadata?.role || user?.app_metadata?.role;
  
  if (!userRole || userRole !== role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Export default for main usage
export default ProtectedRoute;