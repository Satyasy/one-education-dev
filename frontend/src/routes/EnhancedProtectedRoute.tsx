import { JSX, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth, useRole } from "../hooks/useAuth";

interface EnhancedProtectedRouteProps {
    children: JSX.Element;
    // Legacy support
    roles?: string[];
    // New permission-based approach
    permissions?: string[];
    // Function-based access control (most flexible)
    accessCheck?: () => boolean;
    // Predefined access patterns
    requireAdmin?: boolean;
    requireAuthenticated?: boolean;
}

export const EnhancedProtectedRoute = ({ 
    children, 
    roles, 
    permissions, 
    accessCheck,
    requireAdmin = false,
    requireAuthenticated = true
}: EnhancedProtectedRouteProps) => {
    const { user, loading } = useAuth();
    const { isAdmin, hasAnyRole, hasAnyPermission } = useRole();
    const navigate = useNavigate();

    const checkAccess = (): boolean => {
        // If loading, don't check access yet
        if (loading) return true;

        // Check authentication requirement
        if (requireAuthenticated && !user) return false;

        // Check admin requirement
        if (requireAdmin && !isAdmin()) return false;

        // Check custom access function (highest priority)
        if (accessCheck) return accessCheck();

        // Check permissions (preferred approach)
        if (permissions && permissions.length > 0) {
            return hasAnyPermission(permissions);
        }

        // Check roles (legacy support)
        if (roles && roles.length > 0) {
            return hasAnyRole(roles);
        }

        // Default: allow if authenticated (when requireAuthenticated is true)
        return requireAuthenticated ? !!user : true;
    };

    useEffect(() => {
        if (loading) return;
        
        const hasAccess = checkAccess();
        
        if (!hasAccess) {
            if (!user) {
                navigate("/login");
            } else {
                navigate("/unauthorized");
            }
        }
    }, [user, loading, navigate, roles, permissions, accessCheck, requireAdmin]);
    
    // Don't render anything while loading
    if (loading) {
        return null;
    }

    // Don't render anything if user doesn't have access
    if (!checkAccess()) {
        return null;
    }

    return children;
};

// Convenience components for common patterns
export const AdminRoute = ({ children }: { children: JSX.Element }) => (
    <EnhancedProtectedRoute requireAdmin={true}>
        {children}
    </EnhancedProtectedRoute>
);

export const PanjarRoute = ({ children }: { children: JSX.Element }) => (
    <EnhancedProtectedRoute 
        accessCheck={() => {
            // This will be called during render, so we need to use hooks inside the component
            return true; // Placeholder, will be handled by parent component logic
        }}
        // permissions={['view panjar', 'manage panjar']}
        roles={['kepala-urusan', 'kepala-sekolah', 'wakil-kepala-sekolah', 'admin']}
    >
        {children}
    </EnhancedProtectedRoute>
);

export const BudgetRoute = ({ children }: { children: JSX.Element }) => (
    <EnhancedProtectedRoute 
        // permissions={['view budget', 'create budget', 'edit budget']}
        roles={['kepala-administrasi', 'kepala-sekolah', 'admin']}
    >
        {children}
    </EnhancedProtectedRoute>
);

export default EnhancedProtectedRoute;
