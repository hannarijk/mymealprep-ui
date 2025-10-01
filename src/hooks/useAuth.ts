import { useState, useCallback } from 'react';
import { authService, type AuthResponse } from '@/services/authService';

interface AuthState {
    user: AuthResponse['user'] | null;
    token: string | null;
    isLoading: boolean;
}

export function useAuth() {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: localStorage.getItem('token'),
        isLoading: false,
    });

    const login = useCallback(async (email: string, password: string) => {
        setState(prev => ({ ...prev, isLoading: true }));

        try {
            const response = await authService.login({ email, password });
            localStorage.setItem('token', response.token);
            setState({
                user: response.user,
                token: response.token,
                isLoading: false,
            });
            return response;
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    }, []);

    const register = useCallback(async (email: string, password: string) => {
        setState(prev => ({ ...prev, isLoading: true }));

        try {
            const response = await authService.register({ email, password });
            localStorage.setItem('token', response.token);
            setState({
                user: response.user,
                token: response.token,
                isLoading: false,
            });
            return response;
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setState({
            user: null,
            token: null,
            isLoading: false,
        });
    }, []);

    return {
        ...state,
        login,
        register,
        logout,
        isAuthenticated: !!state.token,
    };
}