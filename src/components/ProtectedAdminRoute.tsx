// /home/project/src/components/ProtectedAdminRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, AlertTriangle } from 'lucide-react';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ 
  children, 
  requireSuperAdmin = false 
}) => {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  if (!user) {
    console.log("[ProtectedAdminRoute] No user, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // SIMPLE ADMIN CHECK - Just check the email
  const isAdmin = user.email === 'info@colonaive.ai';

  console.log("[ProtectedAdminRoute] Admin check:", {
    email: user.email,
    isAdmin
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
          <Shield className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-orange-600 mb-4">Admin Access Required</h1>
          <p className="text-gray-600 mb-6">
            You need administrator privileges to access this area.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Logged in as: {user.email}
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // User is admin, show the protected content
  console.log("[ProtectedAdminRoute] ✅ Admin access granted");
  return <>{children}</>;
};