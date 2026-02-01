import {apiClient} from './apiClient.ts';

export interface APIRecipeCategoryResponse {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface APIRecipeResponse {
    id: number;
    name: string;
    description?: string;
    category_id?: number;
    created_at: string;
    updated_at: string;
}

export interface RecipeCategory {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Recipe {
    id: number;
    name: string;
    description?: string;
    categoryId?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CategoryServiceError {
    message: string;
    statusCode?: number;
    code?: string;
}

class RecipeService {
    async getAll(): Promise<RecipeCategory[]> {
        try {
            const response = await apiClient.get<APIRecipeCategoryResponse[]>('/categories');
            return response.data.map(this.transformCategory);
        } catch (error) {
            throw this.handleError(error, 'Failed to load categories');
        }
    }

    async getRecipesByCategory(categoryId: number): Promise<Recipe[]> {
        try {
            const response = await apiClient.get<APIRecipeResponse[]>(`/categories/${categoryId}/recipes`);
            return response.data.map(this.transformRecipe);
        } catch (error) {
            throw this.handleError(error, `Failed to load recipes for category`);
        }
    }

    async getAllRecipes(): Promise<Recipe[]> {
        try {
            const response = await apiClient.get<APIRecipeResponse[]>('/recipes');
            return response.data.map(this.transformRecipe);
        } catch (error) {
            throw this.handleError(error, 'Failed to load recipes');
        }
    }

    async getRecipeById(recipeId: number): Promise<Recipe> {
        try {
            const response = await apiClient.get<APIRecipeResponse>(`/recipes/${recipeId}`);
            return response.data.map(this.transformRecipe);
        } catch (error) {
            throw this.handleError(error, 'Failed to load recipee');
        }
    }

    /**
     * Transform backend category to frontend format
     * Handles: snake_case → camelCase, string dates → Date objects
     */
    private transformCategory(apiCategory: APIRecipeCategoryResponse): RecipeCategory {
        return {
            id: apiCategory.id,
            name: apiCategory.name,
            description: apiCategory.description,
            createdAt: new Date(apiCategory.created_at),
            updatedAt: new Date(apiCategory.updated_at)
        };
    }

    /**
     * Transform backend recipe to frontend format
     * Handles: snake_case → camelCase, string dates → Date objects
     */
    private transformRecipe(apiRecipe: APIRecipeResponse): Recipe {
        return {
            id: apiRecipe.id,
            name: apiRecipe.name,
            description: apiRecipe.description,
            categoryId: apiRecipe.category_id,
            createdAt: new Date(apiRecipe.created_at),
            updatedAt: new Date(apiRecipe.updated_at)
        };
    }

    private handleError(error: unknown, fallbackMessage: string): CategoryServiceError {
        // Extract error details
        let message = fallbackMessage;
        let statusCode: number | undefined;
        let code: string | undefined;

        // Check if it's an Axios error
        if (this.isAxiosError(error)) {
            if (error.response) {
                // Backend returned an error response
                statusCode = error.response.status;
                message = error.response.data?.message || error.response.data?.error || fallbackMessage;
                code = error.response.data?.code;
            } else if (error.request) {
                // Network error - no response received
                message = 'Network error - unable to connect to server';
            } else {
                // Request setup error
                message = error.message || fallbackMessage;
            }
        } else if (error instanceof Error) {
            // Standard JavaScript Error
            message = error.message;
        } else {
            // Unknown error type
            message = fallbackMessage;
        }

        const serviceError = new Error(message) as Error & CategoryServiceError;
        serviceError.statusCode = statusCode;
        serviceError.code = code;

        return serviceError;
    }

    private isAxiosError(error: unknown): error is {
        response?: {
            status: number;
            data?: {
                message?: string;
                error?: string;
                code?: string;
            };
        };
        request?: unknown;
        message?: string;
    } {
        return (
            typeof error === 'object' &&
            error !== null &&
            ('response' in error || 'request' in error || 'message' in error)
        );
    }

}

export const recipeService = new RecipeService();

export {RecipeService};