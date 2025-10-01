interface Config {
    apiBaseUrl: string;
    environment: 'development' | 'staging' | 'production';
    isDevelopment: boolean;
    isProduction: boolean;
}

function createConfig(): Config {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const environment = import.meta.env.VITE_APP_ENV || 'development';

    if (!apiBaseUrl) {
        throw new Error('VITE_API_BASE_URL environment variable is required');
    }

    return {
        apiBaseUrl,
        environment: environment as Config['environment'],
        isDevelopment: environment === 'development',
        isProduction: environment === 'production',
    };
}

export const config = createConfig();