import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { type ReactNode } from 'react';

/**
 * ProtectedRoute - Authentication guard for private routes
 *
 * How it works:
 * 1. Check if user is authenticated
 * 2. If YES → render the protected page
 * 3. If NO → redirect to home (where they can login)
 * 4. While checking → show loading state (prevents flash)
 */

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();

    /**
     * Step 1: Loading state
     *
     * Why needed: Prevents flash of redirect while checking token
     *
     * Flow:
     * - App starts → isLoading = true (checking localStorage)
     * - AuthProvider checks token → takes ~1ms
     * - isLoading = false → render decision made
     *
     * Without this: User sees redirect flash even when logged in (bad UX)
     */
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-rose-600 border-r-transparent"></div>
                    <p className="mt-4 text-sm text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    /**
     * Step 2: Authentication check
     *
     * If not authenticated → redirect to home
     * - replace: true → prevents back button going to protected page
     * - User can login from home page
     */
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    /**
     * Step 3: Authorized access
     *
     * User is authenticated → render the protected content
     */
    return <>{children}</>;
}