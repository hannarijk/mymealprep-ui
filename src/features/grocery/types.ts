export interface GroceryListItem {
    ingredientId: number;
    ingredient: {
        id: number;
        name: string;
        category?: string;
    };
    totalQuantity: number;
    unit: string;
    recipes: string[];
}
