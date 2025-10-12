import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PublicLanding from '@/pages/LandingPage';
import { ProtectedRoute } from '@/components/routing/ProtectedRoute';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Route - Landing Page */}
                <Route path="/" element={<PublicLanding />} />

                {/* Protected Route - Private Dashboard for authenticated users */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPlaceholder />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback - redirect unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

/**
 * Temporary Dashboard Placeholder
 */
function DashboardPlaceholder() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4">🎉 Dashboard</h1>
                <p className="text-gray-600 mb-4">
                    Welcome, {user?.email || 'User'}!
                </p>
                <p className="text-sm text-gray-500 mb-6">
                    You successfully logged in. Next step: we'll add the real dashboard UI.
                </p>
                <button
                    onClick={logout}
                    className="w-full bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}