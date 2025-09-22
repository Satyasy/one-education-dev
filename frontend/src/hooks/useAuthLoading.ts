import { useAuth } from "./useAuth";

export const useAuthLoading = () => {
    const { loading, user } = useAuth();
    
    return {
        isAuthLoading: loading,
        isAuthenticated: !!user && !loading,
        isUnauthenticated: !user && !loading,
        shouldShowLoader: loading,
        shouldRedirectToLogin: !user && !loading
    };
}; 