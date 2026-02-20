import axios from 'axios';
import { config } from '@/config/env';

/**
 * API Client with Automatic Token Injection
 *
 * Axios interceptor for authentication
 *
 * How it works:
 * 1. Every request passes through the interceptor
 * 2. Interceptor reads token from localStorage
 * 3. Adds Authorization header automatically
 * 4. Request proceeds to backend
 *
 * Benefits:
 * - No need to pass token manually
 * - Centralized auth logic
 * - Easy to add error handling (token expired, etc.)
 * - Consistent headers across all requests
 */

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: config.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

/**
 * Request Interceptor - Runs BEFORE every request
 *
 * Purpose: Inject authentication token
 *
 * Flow:
 * Component calls: apiClient.get('/recipes')
 *   ↓
 * Interceptor runs: adds Authorization header
 *   ↓
 * Request sent: GET /recipes with Bearer token
 */
apiClient.interceptors.request.use(
    (config) => {
        // Read token from localStorage (where AuthContext stores it)
        const token = localStorage.getItem('token');

        // If token exists, add to Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Handle request configuration errors
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor - Runs AFTER every response
 *
 * Purpose: Handle common errors (401, token expired, etc.)
 *
 * Future enhancement: Auto-logout on 401, retry on network errors
 */
apiClient.interceptors.response.use(
    (response) => {
        // Success response - return as is
        return response;
    },
    (error) => {
        // Handle different error scenarios

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/';
        }

        if (error.response?.status === 403) {
            // Forbidden - user doesn't have permission
            console.error('Access forbidden');
        }

        if (!error.response) {
            // Network error - no response from server
            console.error('Network error - server unreachable');
        }

        return Promise.reject(error);
    }
);

export { apiClient };