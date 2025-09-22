import { useState, useEffect, ReactNode, useCallback } from "react";
import { User } from "../types/auth";
import { AuthContext, AuthContextType } from "../context/AuthContext";
import authService from "../api/authService";

interface AuthProviderProps {
  children: ReactNode;
}

// Custom error types for better error handling
export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear error when user state changes
  useEffect(() => {
    if (user) {
      setError(null);
    }
  }, [user]);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUser = await authService.getUser();
      setUser(currentUser);
      
      return currentUser;
    } catch (error) {
      console.warn("Authentication check failed:", error);
      setUser(null);
      // Don't set error for initial auth check as it's expected to fail sometimes
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      const loginResponse = await authService.login(email, password);
      console.log('Login response:', loginResponse);
      
      // Set user immediately to provide better UX
      setUser(loginResponse);
      
      // Try to refresh user data but don't fail if it doesn't work
      try {
        const freshUserData = await authService.getUser();
        if (freshUserData) {
          setUser(freshUserData);
          return freshUserData;
        } else {
          // If refresh returns null, keep login response
          return loginResponse;
        }
      } catch (refreshError) {
        console.warn("Failed to refresh user data after login:", refreshError);
        // Return login response if refresh fails
        return loginResponse;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      console.error("Login failed:", error);
      setError(errorMessage);
      setUser(null);
      throw new AuthError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (callback?: () => void): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.logout();
      setUser(null);
      
      if (callback) {
        callback();
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear user state even if logout API fails
      setUser(null);
      setError("Logout failed, but you have been signed out locally");
    } finally {
      setLoading(false);
    }
  }, []);

  // Utility function to refresh user data
  const refreshUser = useCallback(async (): Promise<User | null> => {
    return await checkAuth();
  }, [checkAuth]);

  const value: AuthContextType = {
    user,
    setUser,
    loading,
    error,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;