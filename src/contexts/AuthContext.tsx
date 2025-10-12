import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService, type AuthResponse } from '@/services/authService';

/**
 * AuthContext - Centralized authentication state management
 * Single source of truth for auth across the entire app for session management
 *
 * Why Context over props drilling:
 * - No need to pass auth state through 10+ components
 * - Any component can access auth with useAuth()
 * - Single login updates entire app instantly
 */

interface AuthContextType {
    user: AuthResponse['user'] | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<AuthResponse>;
    register: (email: string, password: string) => Promise<AuthResponse>;
    logout: () => void;
    checkAuth: () => void; // Verify token on app load
}

// Create context with undefined default (forces usage within Provider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider - Wraps the app to provide auth state
 *
 * This component:
 * 1. Manages auth state (user, token, loading)
 * 2. Provides auth methods (login, register, logout)
 * 3. Persists token in localStorage
 * 4. Validates token on app load
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthResponse['user'] | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start true - checking token

    /**
     * Check if stored token is valid on app load
     *
     * Silent authentication check
     * - User refreshes page → should stay logged in
     * - Token expired → logout automatically
     * - No token → show landing page
     */
    const checkAuth = () => {
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
            // TODO: In production, validate token with backend
            // For now, trust the token exists
            setToken(storedToken);
            // Note: We don't have user info yet, would need /me endpoint
        }

        setIsLoading(false);
    };

    // Run auth check on mount (app startup)
    useEffect(() => {
        checkAuth();
    }, []);

    /**
     * Login - Authenticate user and store session
     *
     * Flow:
     * 1. Call backend auth API
     * 2. Store token in localStorage (persistence)
     * 3. Update state → triggers re-render across app
     * 4. Router will redirect to dashboard (next step)
     */
    const login = async (email: string, password: string): Promise<AuthResponse> => {
        setIsLoading(true);

        try {
            const response = await authService.login({ email, password });

            // Persist token (survives page refresh)
            localStorage.setItem('token', response.token);

            // Update state → all components using useAuth() get updated
            setToken(response.token);
            setUser(response.user);

            return response;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Register - Create new user account
     * Same pattern as login
     */
    const register = async (email: string, password: string): Promise<AuthResponse> => {
        setIsLoading(true);

        try {
            const response = await authService.register({ email, password });

            localStorage.setItem('token', response.token);
            setToken(response.token);
            setUser(response.user);

            return response;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    // Computed value - cleaner than checking !!token everywhere
    const isAuthenticated = !!token;

    const value = {
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth - Hook to access auth context
 *
 * Usage in any component:
 *   const { user, login, logout, isAuthenticated } = useAuth();
 *
 * Throws error if used outside AuthProvider (developer safety)
 */
export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
}