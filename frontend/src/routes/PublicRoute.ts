import { JSX, useEffect, createElement, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import LoadingOverlay from "../components/ui/LoadingOverlay";

interface PublicRouteProps {
    children: JSX.Element;
    redirectTo?: string;
}

export const PublicRoute = ({ children, redirectTo = "/" }: PublicRouteProps) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (loading) return;
        
        if (user) {
            setIsRedirecting(true);
            navigate(redirectTo);
            return;
        }
    }, [user, loading, navigate, redirectTo]);
    
    // Show loading overlay while checking authentication
    if (loading) {
        return createElement(LoadingOverlay, {
            isVisible: true,
            message: "Checking authentication...",
            size: "lg"
        });
    }

    // Show loading overlay while redirecting authenticated user
    if (user && isRedirecting) {
        return createElement(LoadingOverlay, {
            isVisible: true,
            message: "Redirecting to dashboard...",
            size: "lg"
        });
    }

    // Don't render anything if user is authenticated but not showing redirect loading
    if (user) {
        return null;
    }

    return children;
};

export default PublicRoute; 