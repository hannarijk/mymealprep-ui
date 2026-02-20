import {apiClient} from './apiClient.ts';
import {AxiosError} from 'axios';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface User {
    id: number;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface ApiError {
    error: string;
    code: number;
    message: string;
}

/**
 * Extract error message from various error types
 */
function getErrorMessage(error: unknown, fallback: string): string {
    // Axios error with response from backend
    if (error instanceof AxiosError) {
        return error.response?.data?.message || fallback;
    }

    // Standard JavaScript Error
    if (error instanceof Error) {
        return error.message;
    }

    // Unknown error type - use fallback
    return fallback;
}

/**
 * AuthService - Authentication API calls
 *
 * Service layer with axios client
 * - Uses apiClient for all HTTP requests
 * - Token automatically injected by interceptor
 * - Type-safe error handling (no 'any' types)
 */
class AuthService {

    async login(credentials: LoginRequest): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
            return response.data;
        } catch (error: unknown) {
            throw new Error(getErrorMessage(error, 'Login failed'));
        }
    }

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>('/auth/register', userData);
            return response.data;
        } catch (error: unknown) {
            throw new Error(getErrorMessage(error, 'Registration failed'));
        }
    }

    async me(): Promise<User> {
        try {
            const response = await apiClient.get<User>('/auth/me');
            return response.data;
        } catch (error: unknown) {
            throw new Error(getErrorMessage(error, 'Failed to fetch current user'));
        }
    }

    async get<T>(endpoint: string): Promise<T> {
        try {
            const response = await apiClient.get<T>(endpoint);
            return response.data;
        } catch (error: unknown) {
            throw new Error(getErrorMessage(error, 'Request failed'));
        }
    }
}

export const authService = new AuthService();