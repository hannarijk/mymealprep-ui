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

export interface APIIngredientResponse {
    id: number;
    name: string;
    description?: string;
    category?: string;
    created_at: string;
}

export interface APIRecipeIngredientResponse {
    id?: number;
    recipe_id: number;
    ingredient_id: number;
    quantity: number;
    unit: string;
    notes?: string;
    ingredient: APIIngredientResponse;
}

export interface APIRecipeWithIngredientsResponse {
    id: number;
    name: string;
    description?: string;
    category_id?: number;
    created_at: string;
    updated_at: string;
    ingredients: APIRecipeIngredientResponse[];
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

export interface Ingredient {
    id: number;
    name: string;
    description?: string;
    category?: string;
    createdAt: Date;
}

export interface RecipeIngredient {
    id?: number;
    recipeId: number;
    ingredientId: number;
    quantity: number;
    unit: string;
    notes?: string;
    ingredient: Ingredient;
}

export interface RecipeWithIngredients extends Recipe {
    ingredients: RecipeIngredient[];
}

export interface CategoryServiceError {
    message: string;
    statusCode?: number;
    code?: string;
}

class RecipeService {
    async getAllRecipeCategories(): Promise<RecipeCategory[]> {
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

    async getRecipesByCategoryWithIngredients(categoryId: number): Promise<RecipeWithIngredients[]> {
        try {
            const response = await apiClient.get<APIRecipeWithIngredientsResponse[]>(`/categories/${categoryId}/recipes?include_ingredients=true`);
            return response.data.map(this.transformRecipeWithIngredients)
        } catch (error) {
            throw this.handleError(error, 'Failed to load category recipes with ingredients');
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
            return this.transformRecipe(response.data);
        } catch (error) {
            throw this.handleError(error, 'Failed to load recipe');
        }
    }

    async getRecipeByIdWithIngredients(recipeId: number): Promise<RecipeWithIngredients> {
        try {
            const response = await apiClient.get<APIRecipeWithIngredientsResponse>(`/recipes/${recipeId}?include_ingredients=true`);
            return this.transformRecipeWithIngredients(response.data);
        } catch (error) {
            throw this.handleError(error, 'Failed to load recipe with ingredients');
        }
    }

    async getRecipeIngredients(recipeId: number): Promise<RecipeIngredient[]> {
        try {
            const response = await apiClient.get<APIRecipeIngredientResponse[]>(`/recipes/${recipeId}/ingredients`);
            return response.data.map(this.transformRecipeIngredient);
        } catch (error) {
            throw this.handleError(error, 'Failed to load recipe ingredients');
        }
    }

    async getIngredients(): Promise<Ingredient[]> {
        try {
            const response = await apiClient.get<APIIngredientResponse[]>('/ingredients');
            return response.data.map(this.transformIngredient);
        } catch (error) {
            throw this.handleError(error, 'Failed to load ingredients');
        }
    }

    private transformCategory(apiCategory: APIRecipeCategoryResponse): RecipeCategory {
        return {
            id: apiCategory.id,
            name: apiCategory.name,
            description: apiCategory.description,
            createdAt: new Date(apiCategory.created_at),
            updatedAt: new Date(apiCategory.updated_at)
        };
    }

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

    private transformIngredient(ingredient: APIIngredientResponse): Ingredient {
        return {
            id: ingredient.id,
            name: ingredient.name,
            description: ingredient.description,
            category: ingredient.category,
            createdAt: new Date(ingredient.created_at),
        };
    }

    private transformRecipeIngredient(apiRecipeIngredient: APIRecipeIngredientResponse): RecipeIngredient {
        return {
            id: apiRecipeIngredient.id,
            recipeId: apiRecipeIngredient.recipe_id,
            ingredientId: apiRecipeIngredient.ingredient_id,
            quantity: apiRecipeIngredient.quantity,
            unit: apiRecipeIngredient.unit,
            notes: apiRecipeIngredient.notes,
            ingredient: this.transformIngredient(apiRecipeIngredient.ingredient)
        };
    }

    private transformRecipeWithIngredients(recipe: APIRecipeWithIngredientsResponse): RecipeWithIngredients {
        return {
            id: recipe.id,
            name: recipe.name,
            description: recipe.description,
            categoryId: recipe.category_id,
            createdAt: new Date(recipe.created_at),
            updatedAt: new Date(recipe.updated_at),
            ingredients: recipe.ingredients.map(this.transformRecipeIngredient)
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