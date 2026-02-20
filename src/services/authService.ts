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

export interface AuthServiceError {
    message: string;
    statusCode?: number;
    code?: string;
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
            throw this.handleError(error, 'Login failed');
        }
    }

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>('/auth/register', userData);
            return response.data;
        } catch (error: unknown) {
            throw this.handleError(error, 'Registration failed');
        }
    }

    async me(): Promise<User> {
        try {
            const response = await apiClient.get<User>('/auth/me');
            return response.data;
        } catch (error: unknown) {
            throw this.handleError(error, 'Failed to fetch current user');
        }
    }

    async get<T>(endpoint: string): Promise<T> {
        try {
            const response = await apiClient.get<T>(endpoint);
            return response.data;
        } catch (error: unknown) {
            throw this.handleError(error, 'Request failed');
        }
    }

    private handleError(error: unknown, fallbackMessage: string): AuthServiceError {
        let message = fallbackMessage;
        let statusCode: number | undefined;
        let code: string | undefined;

        if (error instanceof AxiosError) {
            if (error.response) {
                statusCode = error.response.status;
                message = error.response.data?.message || error.response.data?.error || fallbackMessage;
                code = error.response.data?.code;
            } else if (error.request) {
                message = 'Network error - unable to connect to server';
            } else {
                message = error.message || fallbackMessage;
            }
        } else if (error instanceof Error) {
            message = error.message;
        }

        const serviceError = new Error(message) as Error & AuthServiceError;
        serviceError.statusCode = statusCode;
        serviceError.code = code;

        return serviceError;
    }
}

export const authService = new AuthService();