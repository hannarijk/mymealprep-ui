import { useState } from 'react';
import { AppButton } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
    onSuccess?: () => void;
    onSwitchToLogin?: () => void;
    onSwitchToSignup?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToSignup }: AuthFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
            onSuccess?.();  // Close modal
            navigate('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Enter your email"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Enter your password"
                />
            </div>

            {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                </div>
            )}

            <AppButton
                type="submit"
                intent="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? 'Signing in...' : 'Sign in'}
            </AppButton>

            <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                    type="button"
                    onClick={onSwitchToSignup}
                    className="text-rose-600 hover:text-rose-700 font-medium"
                >
                    Sign up
                </button>
            </p>
        </form>
    );
}

export function SignupForm({ onSuccess, onSwitchToLogin }: AuthFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await register(email, password);
            onSuccess?.();  // Close modal
            navigate('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Enter your email"
                />
            </div>

            <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                </label>
                <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Create a password"
                />
            </div>

            {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                </div>
            )}

            <AppButton
                type="submit"
                intent="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? 'Creating account...' : 'Create account'}
            </AppButton>

            <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-rose-600 hover:text-rose-700 font-medium"
                >
                    Sign in
                </button>
            </p>
        </form>
    );
}