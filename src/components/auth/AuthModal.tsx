import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { LoginForm, SignupForm } from './AuthForms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

    // Reset mode when modal opens
    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
        }
    }, [isOpen, initialMode]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSuccess = () => {
        onClose();
        // Optionally redirect to dashboard or refresh page
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <Card className="relative w-full max-w-md bg-white shadow-xl">
                <CardHeader className="relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-lg p-1 hover:bg-gray-100 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <CardTitle className="text-2xl font-semibold">
                        {mode === 'login' ? 'Sign in to MyMealPrep' : 'Create your account'}
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {mode === 'login' ? (
                        <LoginForm
                            onSuccess={handleSuccess}
                            onSwitchToSignup={() => setMode('signup')}
                        />
                    ) : (
                        <SignupForm
                            onSuccess={handleSuccess}
                            onSwitchToLogin={() => setMode('login')}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}