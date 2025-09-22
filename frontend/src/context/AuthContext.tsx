import { createContext } from "react";
import { User } from "../types/auth";


export interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<User>;
    logout: (callback?: () => void) => Promise<void>;
    refreshUser: () => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
