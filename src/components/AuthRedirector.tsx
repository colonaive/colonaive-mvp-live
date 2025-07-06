import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Import the dashboard route function from ProtectedRoute
import { getDashboardRoute, normalizeUserType } from './ProtectedRoute';

const AuthRedirector = () => {
  const { user, loading: authLoading, userType, isSuperAdmin, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) {
      console.log("[AuthRedirector] Auth loading, waiting...");
      return; 
    }

    console.log("[AuthRedirector] Auth state:", {
      isLoading: authLoading,
      hasUser: !!user,
      userEmail: user?.email,
      userType,
      isSuperAdmin,
      hasProfile: !!profile,
      profileType: profile?.user_type
    });

    if (user) {
      console.log("[AuthRedirector] User found:", {
        email: user.email,
        userType,
        isSuperAdmin,
        profile
      });

      // Check for admin email first
      if (user.email === 'info@colonaive.ai') {
        console.log("[AuthRedirector] 🚀 ADMIN EMAIL DETECTED! Redirecting to admin dashboard");
        navigate('/admin/dashboard', { replace: true }); 
        return;
      }

      // Use the standardized dashboard route function
      const dashboardPath = getDashboardRoute(userType);
      
      console.log("[AuthRedirector] Regular user redirecting to:", dashboardPath); 
      console.log("[AuthRedirector] User type details:", {
        originalUserType: userType,
        dashboardPath,
        normalizedUserType: normalizeUserType(userType),
        profileUserType: profile?.user_type
      });
      
      navigate(dashboardPath, { replace: true });
    } else {
      console.log("[AuthRedirector] No user, redirecting to login");
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, userType, isSuperAdmin, profile, navigate]);

  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="ml-3">Loading your dashboard...</p>
    </div>;
  }

  return null;
};

export default AuthRedirector;