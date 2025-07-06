import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Import the dashboard route function from ProtectedRoute
import { getDashboardRoute } from './ProtectedRoute';

const AuthRedirector = () => {
  const { user, loading: authLoading, userType, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) {
      console.log("[AuthRedirector] Auth loading, waiting...");
      return; 
    }

    if (user) {
      console.log("[AuthRedirector] User found:", {
        email: user.email,
        userType,
        isSuperAdmin
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
        normalizedUserType: normalizeUserType(userType)
      });
      
      navigate(dashboardPath, { replace: true });
    } else {
      console.log("[AuthRedirector] No user, redirecting to login");
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, userType, isSuperAdmin, navigate]);

  return null;
};

export default AuthRedirector;