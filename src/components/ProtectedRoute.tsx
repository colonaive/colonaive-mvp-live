import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

// Standardized user type mapping
export const USER_TYPES = {
  CHAMPION: 'champion',
  CORPORATE: 'corporate_contact', 
  GP_CLINIC: 'gpclinic',
  SPECIALIST: 'specialist',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
} as const;

// Function to normalize user types for comparison
export const normalizeUserType = (userType: string | null | undefined): string => {
  if (!userType) return USER_TYPES.CHAMPION;
  
  const trimmed = userType.trim().toLowerCase();
  
  // Handle various naming conventions
  switch (trimmed) {
    case 'champion':
    case 'member':
      return USER_TYPES.CHAMPION;
    case 'corporate':
    case 'corporate_contact':
    case 'corporatecontact': 
      return USER_TYPES.CORPORATE;
    case 'gpclinic':
    case 'gp_clinic': 
    case 'gp-clinic':
    case 'gp clinic':
      return USER_TYPES.GP_CLINIC;
    case 'specialist':
    case 'specialists':
      return USER_TYPES.SPECIALIST;
    case 'admin':
    case 'administrator':
      return USER_TYPES.ADMIN;
    case 'super_admin':
    case 'superadmin':
    case 'super-admin':
    case 'super admin':
      return USER_TYPES.SUPER_ADMIN;
    default:
      console.warn('[ProtectedRoute] Unknown user type:', userType, 'defaulting to champion');
      return USER_TYPES.CHAMPION;
  }
};

// The single source of truth for dashboard routing
export function getDashboardRoute(userType: string | null | undefined): string {
  const normalizedType = normalizeUserType(userType);

  console.log('[getDashboardRoute] Input:', userType, '-> Normalized:', normalizedType); 
  
  switch (normalizedType) {
    case USER_TYPES.CHAMPION:
      return '/dashboard/champion';
    case USER_TYPES.CORPORATE:
      return '/dashboard/corporate';
    case USER_TYPES.GP_CLINIC:
      return '/dashboard/gp-clinic'; 
    case USER_TYPES.SPECIALIST:
      return '/dashboard/specialist';
    case USER_TYPES.ADMIN:
      return '/admin/dashboard';
    case USER_TYPES.SUPER_ADMIN:
      return '/super-admin/dashboard';
    default:
      console.warn('[getDashboardRoute] Unhandled user type:', normalizedType);
      return '/dashboard/champion';
  }
}

// Function to check if user has required permissions
export const hasRequiredPermissions = (
  userType: string | null,
  isSuperAdmin: boolean,
  allowedUserTypes?: string[],
  requiresSuperAdmin?: boolean
): boolean => {
  // Super admin check
  if (requiresSuperAdmin && !isSuperAdmin) {
    return false;
  }
  
  // If no specific user types required, allow all authenticated users
  if (!allowedUserTypes || allowedUserTypes.length === 0) {
    return true;
  }
  
  // Super admins can access everything (unless specifically restricted)
  if (isSuperAdmin && !requiresSuperAdmin) {
    return true;
  }
  
  // Check if user type is in allowed list
  const normalizedUserType = normalizeUserType(userType);
  const normalizedAllowedTypes = allowedUserTypes.map(type => normalizeUserType(type));
  
  return normalizedAllowedTypes.includes(normalizedUserType);
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  allowedUserTypes?: string[];
  requiresSuperAdmin?: boolean;
}

export function ProtectedRoute({ 
  children, 
  fallback, 
  allowedUserTypes,
  requiresSuperAdmin = false 
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, userType, isSuperAdmin } = useAuth();
  const location = useLocation();

  console.log('[ProtectedRoute] Auth state:', {
    isAuthenticated,
    loading,
    userType,
    isSuperAdmin,
    allowedUserTypes,
    requiresSuperAdmin,
    currentPath: location.pathname
  });

  if (loading) return fallback || <LoadingSpinner />;
  
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check permissions if specified
  if (allowedUserTypes || requiresSuperAdmin) {
    const hasPermission = hasRequiredPermissions(
      userType, 
      isSuperAdmin, 
      allowedUserTypes, 
      requiresSuperAdmin
    );

    if (!hasPermission) {
      console.log('[ProtectedRoute] User lacks required permissions:', {
        userType,
        isSuperAdmin,
        allowedUserTypes,
        requiresSuperAdmin
      });
      
      // Redirect to appropriate dashboard
      const defaultRedirect = getDashboardRoute(userType);
      return <Navigate to={defaultRedirect} replace />;
    }
  }

  return <>{children}</>;
}

interface PublicRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PublicRoute({ children, fallback }: PublicRouteProps) {
  const { isAuthenticated, loading, userType } = useAuth();
  const location = useLocation();
  
  if (loading) return fallback || <LoadingSpinner />;
  
  if (isAuthenticated) {
    const redirectPath = getDashboardRoute(userType);
    console.log('[PublicRoute] User authenticated, redirecting to:', redirectPath);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}

interface RequireRoleProps {
  children: React.ReactNode;
  role: string | string[];
  fallback?: React.ReactNode;
}

export function RequireRole({ children, role, fallback }: RequireRoleProps) {
  const { userType, loading, isAuthenticated, isSuperAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const roles = Array.isArray(role) ? role : [role];
  const normalizedRoles = roles.map(r => normalizeUserType(r));
  
  if (loading) return fallback || <LoadingSpinner />;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const normalizedUserType = normalizeUserType(userType);
  const hasRole = normalizedRoles.includes(normalizedUserType) || isSuperAdmin;

  if (!hasRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You do not have permission to view this page.</p>
          <p className="text-sm text-gray-500">Your current role is: {userType || 'Not defined'}</p>
          <p className="text-sm text-gray-500 mb-6">Required role(s): {roles.join(' or ')}</p>
          <Button onClick={() => navigate(getDashboardRoute(userType))}>
            Go to My Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}

// Specialized route components for common use cases
export const ChampionRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedUserTypes={[USER_TYPES.CHAMPION]}>
    {children}
  </ProtectedRoute>
);

export const CorporateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedUserTypes={[USER_TYPES.CORPORATE]}>
    {children}
  </ProtectedRoute>
);

export const GPClinicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedUserTypes={[USER_TYPES.GP_CLINIC]}>
    {children}
  </ProtectedRoute>
);

export const SpecialistRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedUserTypes={[USER_TYPES.SPECIALIST]}>
    {children}
  </ProtectedRoute>
);

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedUserTypes={[USER_TYPES.ADMIN]} requiresSuperAdmin={false}>
    {children}
  </ProtectedRoute>
);

export const SuperAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiresSuperAdmin={true}>
    {children}
  </ProtectedRoute>
);

// Login redirect component to handle post-login routing
export const LoginRedirectHandler: React.FC = () => {
  const { user, loading, userType, isAuthenticated } = useAuth();
  const location = useLocation();

  console.log('[LoginRedirectHandler] Handling redirect:', {
    user: user?.email,
    loading,
    userType,
    isAuthenticated
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Get the intended destination from location state or default to user's dashboard
  const from = (location.state as any)?.from?.pathname;
  const dashboardRoute = getDashboardRoute(userType);
  const redirectTo = from || dashboardRoute;

  console.log('[LoginRedirectHandler] Redirecting to:', redirectTo);
  
  return <Navigate to={redirectTo} replace />;
};