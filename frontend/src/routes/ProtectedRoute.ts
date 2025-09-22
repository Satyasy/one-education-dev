import { JSX, useEffect } from "react";
import {useNavigate} from "react-router";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
    children: JSX.Element;
    roles?: string[];
}

export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        
        if (!user) {
            navigate("/login");
            return;
        }else if (roles && !user.roles?.some((role) => roles.includes(role))) {
            navigate("/unauthorized");
            return;
        }
    }, [user, loading, navigate, roles]);
    
    // Don't render anything while loading (AppLayout handles loading screen)
    if (loading) {
        return null;
    }

    // Don't render anything if user is not authenticated (redirect is happening)
    if (!user || (roles && !user.roles?.some((role) => roles.includes(role)))) {
        return null;
    }

    return children;
};

export default ProtectedRoute;
