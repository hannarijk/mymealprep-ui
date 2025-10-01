import { config } from '@/config/env';

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

class AuthService {
    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit
    ): Promise<T> {
        const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'An error occurred');
        }

        return data;
    }

    async login(credentials: LoginRequest): Promise<AuthResponse> {
        return this.makeRequest<AuthResponse>('/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        return this.makeRequest<AuthResponse>('/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }
}

export const authService = new AuthService();