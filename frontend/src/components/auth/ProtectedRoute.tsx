import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useRole } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  requireAll?: boolean; // If true, user must have ALL permissions/roles. If false, user needs ANY.
  fallbackPath?: string;
  showUnauthorized?: boolean;
}

/**
 * Component to display when user is not authorized
 */
const UnauthorizedPage: React.FC<{ reason?: string }> = ({ reason }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {reason || 'You do not have permission to access this page.'}
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

/**
 * Protected Route Component
 * 
 * Protects routes based on user permissions and roles using Spatie Laravel Permission structure
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  requireAll = false,
  fallbackPath = '/login',
  showUnauthorized = true,
}) => {
  const { 
    user, 
    hasPermission, 
    hasAnyPermission,
    hasRole,
    hasAnyRole,
    isAdmin
  } = useRole();
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to login');
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Admin bypass - admins can access everything
  if (isAdmin()) {
    return <>{children}</>;
  }

  // Check permissions if specified
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? requiredPermissions.every(permission => hasPermission(permission))
      : hasAnyPermission(requiredPermissions);

    if (!hasRequiredPermissions) {
      if (showUnauthorized) {
        return (
          <UnauthorizedPage 
            reason={`You need ${requireAll ? 'all of these' : 'one of these'} permissions: ${requiredPermissions.join(', ')}`}
          />
        );
      }
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // Check roles if specified
  if (requiredRoles.length > 0) {
    const hasRequiredRoles = requireAll
      ? requiredRoles.every(role => hasRole(role))
      : hasAnyRole(requiredRoles);

    if (!hasRequiredRoles) {
      if (showUnauthorized) {
        return (
          <UnauthorizedPage 
            reason={`You need ${requireAll ? 'all of these' : 'one of these'} roles: ${requiredRoles.join(', ')}`}
          />
        );
      }
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // User has required permissions/roles, render children
  return <>{children}</>;
};

/**
 * Hook to check if current user can access a specific route
 */
export const useRouteAccess = (
  requiredPermissions: string[] = [],
  requiredRoles: string[] = [],
  requireAll: boolean = false
) => {
  const { 
    user,
    hasPermission, 
    hasAnyPermission,
    hasRole,
    hasAnyRole,
    isAdmin
  } = useRole();

  if (!user) return false;
  if (isAdmin()) return true;

  // Check permissions
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? requiredPermissions.every(permission => hasPermission(permission))
      : hasAnyPermission(requiredPermissions);
    
    if (!hasRequiredPermissions) return false;
  }

  // Check roles
  if (requiredRoles.length > 0) {
    const hasRequiredRoles = requireAll
      ? requiredRoles.every(role => hasRole(role))
      : hasAnyRole(requiredRoles);
    
    if (!hasRequiredRoles) return false;
  }

  return true;
};

/**
 * Component for conditional rendering based on permissions
 */
interface PermissionGateProps {
  children: React.ReactNode;
  permissions?: string[];
  roles?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permissions = [],
  roles = [],
  requireAll = false,
  fallback = null,
}) => {
  const canAccess = useRouteAccess(permissions, roles, requireAll);
  
  return canAccess ? <>{children}</> : <>{fallback}</>;
};

/**
 * Higher-order component for protecting components
 */
export const withPermission = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions: string[] = [],
  requiredRoles: string[] = [],
  requireAll: boolean = false
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <ProtectedRoute
        requiredPermissions={requiredPermissions}
        requiredRoles={requiredRoles}
        requireAll={requireAll}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  WrappedComponent.displayName = `withPermission(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default ProtectedRoute;
export { UnauthorizedPage };
