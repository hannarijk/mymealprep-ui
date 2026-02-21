export interface DepartmentGroup {
    name: string;
    items: Array<{ name: string; qty: number; unit?: string }>;
}

export interface Recipe {
    id: string;
    title: string;
    rating?: number;
    tags: string[];
    liked: boolean;
    lastCookedWeeksAgo?: number;
    departments: DepartmentGroup[];
}