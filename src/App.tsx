import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import PublicLanding from '@/pages/LandingPage';
import {ProtectedRoute} from '@/components/routing/ProtectedRoute';

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
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback - redirect unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
