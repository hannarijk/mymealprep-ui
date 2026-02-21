import {useQuery} from '@tanstack/react-query';
import {recipeService} from '@/services/recipeService.ts';
import type {Recipe} from './types';

const TAG_POOL = ["quick", "vegetarian", "vegan", "protein", "budget", "breakfast", "dinner", "gluten-free", "healthy"];

function randomRating(): number {
    return Math.round((Math.random() * 1.5 + 3.5) * 10) / 10;
}

function randomTags(): string[] {
    const count = Math.floor(Math.random() * 2) + 1;
    return [...TAG_POOL].sort(() => Math.random() - 0.5).slice(0, count);
}

export function useRecipes() {
    return useQuery({
        queryKey: ['recipes'],
        queryFn: async (): Promise<Recipe[]> => {
            const data = await recipeService.getAllRecipes();
            return data.map(r => ({
                id: String(r.id),
                title: r.name,
                rating: randomRating(),
                tags: randomTags(),
                liked: false,
                departments: [],
            }));
        },
        staleTime: 5 * 60 * 1000,
    });
}
