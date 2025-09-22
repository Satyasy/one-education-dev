import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useRole } from '../../hooks/useAuth';

interface ProtectedRouteProps {
    children: ReactNode;
    roles?: string[]; // Required roles to access this route
    fallbackPath?: string; // Where to redirect if access denied
    requireAuth?: boolean; // Whether authentication is required
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    roles = [],
    fallbackPath = '/unauthorized',
    requireAuth = true,
}) => {
    const { user, hasAnyRole } = useRole();
    const location = useLocation();

    // Check if user is authenticated
    if (requireAuth && !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If no specific roles required, allow access for authenticated users
    if (roles.length === 0) {
        return <>{children}</>;
    }

    // Check if user has required roles
    if (!hasAnyRole(roles)) {
        return <Navigate to={fallbackPath} replace />;
    }

    return <>{children}</>;
};

// Higher-order component version
export const withRoleProtection = (
    Component: React.ComponentType<any>,
    roles: string[] = [],
    fallbackPath = '/unauthorized'
) => {
    return (props: any) => (
        <ProtectedRoute roles={roles} fallbackPath={fallbackPath}>
            <Component {...props} />
        </ProtectedRoute>
    );
};
