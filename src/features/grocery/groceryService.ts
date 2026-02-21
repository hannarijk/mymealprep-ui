import {apiClient} from '@/services/apiClient.ts';
import type {GroceryListItem} from './types';

interface BackendGroceryItem {
    ingredient_id: number;
    ingredient: {
        id: number;
        name: string;
        category?: string;
    };
    total_quantity: number;
    unit: string;
    recipes: string[];
}

export async function generateGroceryList(recipeIds: number[]): Promise<GroceryListItem[]> {
    const response = await apiClient.post<BackendGroceryItem[]>('/grocery-list', {
        recipe_ids: recipeIds,
    });
    return response.data.map(item => ({
        ingredientId: item.ingredient_id,
        ingredient: {
            id: item.ingredient.id,
            name: item.ingredient.name,
            category: item.ingredient.category,
        },
        totalQuantity: item.total_quantity,
        unit: item.unit,
        recipes: item.recipes,
    }));
}
