import {type ChangeEvent, useEffect, useMemo, useState} from "react";
import {
    CalendarDays,
    Check,
    Copy,
    Filter,
    Heart,
    Link as LinkIcon,
    NotebookPen,
    Plus,
    Sandwich,
    ShoppingCart,
    Shuffle,
    Sparkles,
    Star,
    Trash2,
    Utensils
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Input} from "@/components/ui/input";
import {Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Checkbox} from "@/components/ui/checkbox";
import {Separator} from "@/components/ui/separator";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {ScrollArea} from "@/components/ui/scroll-area";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Switch} from "@/components/ui/switch";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {useAuth} from "@/contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import {recipeService} from "@/services/recipeService.ts";
import {useRecipes} from "@/features/recipes/useRecipes.ts";
import {useQueryClient} from "@tanstack/react-query";
import type {DepartmentGroup, Recipe} from "@/features/recipes/types.ts";
import {generateGroceryList} from "@/features/grocery/groceryService.ts";
import type {GroceryListItem} from "@/features/grocery/types.ts";


// ---------------------- Helper Functions ----------------------
function slugify(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function pickRandom<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

function convertIngredientsToDepartments(ingredients: Awaited<ReturnType<typeof recipeService.getRecipeByIdWithIngredients>>['ingredients']): DepartmentGroup[] {
    const deptMap: Record<string, Array<{ name: string; qty: number; unit?: string }>> = {};
    for (const ri of ingredients) {
        const dept = ri.ingredient.category || "Other";
        if (!deptMap[dept]) deptMap[dept] = [];
        deptMap[dept].push({name: ri.ingredient.name, qty: ri.quantity, unit: ri.unit});
    }
    return Object.entries(deptMap).map(([name, items]) => ({name, items}));
}


// ---------------------- Sub-Components ----------------------
function Chip({active, onClick, children}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1 text-sm rounded-full border ${active ? "bg-primary text-primary-foreground border-primary" : "bg-white hover:bg-slate-50"}`}
        >
            {children}
        </button>
    );
}


function RecipeRow({recipe, onAddBreakfast, onAddMain, onIngredientsLoaded}: {
    recipe: Recipe;
    onAddBreakfast: (id: string) => void;
    onAddMain: (id: string) => void;
    onIngredientsLoaded?: (id: string, departments: DepartmentGroup[]) => void;
}) {
    const [open, setOpen] = useState(false);
    const [published, setPublished] = useState(false);
    const [liked, setLiked] = useState(recipe.liked);
    const [ingredientsLoading, setIngredientsLoading] = useState(false);

    useEffect(() => {
        if (open && recipe.departments.length === 0 && !ingredientsLoading) {
            setIngredientsLoading(true);
            recipeService.getRecipeByIdWithIngredients(Number(recipe.id))
                .then(r => onIngredientsLoaded?.(recipe.id, convertIngredientsToDepartments(r.ingredients)))
                .catch(() => {})
                .finally(() => setIngredientsLoading(false));
        }
    }, [open]);

    return (
        <>
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setOpen(true)}>
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{recipe.title}</div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                {recipe.rating != null && recipe.rating > 0 && (
                                    <span className="flex items-center gap-0.5">
                                        <Star className="h-3 w-3 fill-yellow-400 stroke-yellow-400"/>
                                        {recipe.rating}
                                    </span>
                                )}
                                {recipe.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 w-7 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLiked(!liked);
                                        }}
                                    >
                                        <Heart
                                            className={`h-4 w-4 ${liked ? "fill-yellow-400 stroke-yellow-400" : ""}`}/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Like recipe</TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className="sm:max-w-lg overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>{recipe.title}</SheetTitle>
                        <SheetDescription>
                            <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400"/>
                    {recipe.rating}
                </span>
                                {recipe.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 space-y-4">
                        <div>
                            <h3 className="font-medium mb-2">Ingredients</h3>
                            {ingredientsLoading ? (
                                <p className="text-sm text-muted-foreground">Loading ingredients...</p>
                            ) : recipe.departments.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No ingredients listed.</p>
                            ) : (
                                recipe.departments.map((dept) => (
                                    <div key={dept.name} className="mb-3">
                                        <div className="text-sm font-medium text-muted-foreground">{dept.name}</div>
                                        <ul className="list-disc pl-5 text-sm">
                                            {dept.items.map((item, idx) => (
                                                <li key={idx}>
                                                    {item.name} - {item.qty} {item.unit || ""}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            )}
                        </div>

                        <Separator/>

                        <div className="flex items-center justify-between">
                            <span className="text-sm">Share recipe</span>
                            <Switch checked={published} onCheckedChange={setPublished}/>
                        </div>
                    </div>

                    <SheetFooter className="mt-6 flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => {
                            onAddBreakfast(recipe.id);
                            setOpen(false);
                        }}>
                            Add to Breakfast
                        </Button>
                        <Button className="flex-1" onClick={() => {
                            onAddMain(recipe.id);
                            setOpen(false);
                        }}>
                            Add to Main
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
}

function BucketList({ids, recipes, onRemove}: { ids: string[]; recipes: Recipe[]; onRemove: (id: string) => void }) {
    if (ids.length === 0) {
        return <div className="text-sm text-muted-foreground italic">No recipes added yet.</div>;
    }
    return (
        <div className="grid sm:grid-cols-2 gap-3">
            {ids.map((id) => {
                const recipe = recipes.find((r) => r.id === id);
                if (!recipe) return null;
                return (
                    <Card key={id} className="relative group">
                        <CardContent className="p-3">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">{recipe.title}</div>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star className="h-3 w-3 fill-yellow-400 stroke-yellow-400"/>
                                        <span className="text-xs">{recipe.rating}</span>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
                                    onClick={() => onRemove(id)}
                                >
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

function SectionTitleWithIcon({icon: Icon, title}: { icon: React.ElementType; title: string }) {
    return (
        <div className="flex items-center gap-2 text-lg font-semibold">
            <Icon className="h-5 w-5"/>
            <span>{title}</span>
        </div>
    );
}

function SectionTitle({title}: { title: string }) {
    return (
        <div className="flex items-center gap-2 text-lg font-semibold">
            <span>{title}</span>
        </div>
    );
}

function DepartmentList({name, items, onRemove}: {
    name: string;
    items: GroceryListItem[];
    onRemove: (ingredientId: number) => void;
}) {
    if (items.length === 0) return null;
    return (
        <div>
            <p className="text-sm font-semibold mb-1">{name}</p>
            <Separator className="mb-2"/>
            <ul className="space-y-1 text-sm">
                {items.map((item) => (
                    <li key={item.ingredientId} className="flex items-center justify-between group py-0.5">
                        <span>{item.ingredient.name} — {item.totalQuantity} {item.unit}</span>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            onClick={() => onRemove(item.ingredientId)}
                        >
                            <Trash2 className="h-3 w-3"/>
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function HistoryCardLarge({menu, recipes, publicUrl, onTogglePublic, onLoad}: {
    menu: { week: string; breakfastIds: string[]; mainIds: string[]; isPublic: boolean };
    recipes: Recipe[];
    publicUrl?: string;
    onTogglePublic: (week: string, val: boolean) => void;
    onLoad: (week: string) => void
}) {
    const [copied, setCopied] = useState(false);
    const breakfastTitles = menu.breakfastIds.map((id) => recipes.find((r) => r.id === id)?.title).filter(Boolean) as string[];
    const mainTitles = menu.mainIds.map((id) => recipes.find((r) => r.id === id)?.title).filter(Boolean) as string[];

    const handleCopy = () => {
        if (publicUrl) {
            navigator.clipboard.writeText(publicUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{menu.week}</CardTitle>
                    <div className="flex items-center gap-2">
                        <Switch checked={menu.isPublic} onCheckedChange={(v) => onTogglePublic(menu.week, v)}/>
                        <span className="text-sm">Public</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
                <div className="grid grid-cols-1 gap-2 text-sm flex-1">
                    {breakfastTitles.length > 0 && (
                        <div>
                            <div className="text-xs font-medium uppercase text-muted-foreground">Breakfast</div>
                            <ul className="list-disc pl-5">
                                {breakfastTitles.map((t) => (
                                    <li key={t}>{t}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {mainTitles.length > 0 && (
                        <div>
                            <div className="text-xs font-medium uppercase text-muted-foreground">Lunch + Dinner</div>
                            <ul className="list-disc pl-5">
                                {mainTitles.map((t) => (
                                    <li key={t}>{t}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        {menu.isPublic && publicUrl && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size="sm" variant="outline" onClick={handleCopy}>
                                        {copied ? (
                                            <>
                                                <Check className="h-3 w-3 mr-1"/> Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-3 w-3 mr-1"/> Copy Link
                                            </>
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{publicUrl}</TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                    <Button size="sm" onClick={() => onLoad(menu.week)}>
                        Load
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// ---------------------- Date helpers ----------------------
function monthShort(d: Date) {
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
}

function formatWeekLabel(startISO: string, endISO: string) {
    const s = new Date(startISO);
    const e = new Date(endISO);
    const label = `Week of ${monthShort(s)} ${s.getDate()}-${e.getDate()}, ${e.getFullYear()}`;
    return label;
}

function publicUrlHelper(slug?: string) {
    if (typeof slug !== "string") return undefined;
    const clean = slug.trim();
    if (!clean) return undefined;
    return `https://mymealprep.app/u/demo/${clean}`;
}

// ---------------------- Main Dashboard Component ----------------------
export default function Dashboard() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const {data: recipes = [], isLoading: isLoadingRecipes, error: recipesError} = useRecipes();

    const [activeTab, setActiveTab] = useState("planner");
    const [query, setQuery] = useState("");
    const [weekLabel, setWeekLabel] = useState("Week of Oct 6-12, 2025");

    const [savedMenus, setSavedMenus] = useState<Array<{
        week: string; breakfastIds: string[]; mainIds: string[]; isPublic: boolean; slug: string;
    }>>([]);

    const [breakfastList, setBreakfastList] = useState<string[]>([]);
    const [mainList, setMainList] = useState<string[]>([]);

    const [filters, setFilters] = useState({breakfast: false, vegetarian: false, liked: false});
    const [sortBy, setSortBy] = useState("relevance");
    const [fsOpen, setFsOpen] = useState(false);

    const [groceries, setGroceries] = useState<GroceryListItem[]>([]);
    const [removedIngredientIds, setRemovedIngredientIds] = useState<Set<number>>(new Set());
    const [isGeneratingGroceries, setIsGeneratingGroceries] = useState(false);

    const [weekStart, setWeekStart] = useState("2025-10-06");
    const [weekEnd, setWeekEnd] = useState("2025-10-12");

    function handleIngredientsLoaded(id: string, departments: DepartmentGroup[]) {
        queryClient.setQueryData<Recipe[]>(['recipes'], prev =>
            prev?.map(r => r.id === id ? {...r, departments} : r) ?? []
        );
    }

    const baseFilter = (r: Recipe) => {
        if (filters.breakfast && !r.tags.includes("breakfast")) return false;
        if (filters.vegetarian && !r.tags.includes("vegetarian") && !r.tags.includes("vegan")) return false;
        if (filters.liked && !r.liked) return false;
        return true;
    };

    const sortFns: Record<string, (a: Recipe, b: Recipe) => number> = {
        relevance: () => 0,
        ratingDesc: (a, b) => b.rating - a.rating,
        recency: (a, b) => (a.lastCookedWeeksAgo ?? 9e9) - (b.lastCookedWeeksAgo ?? 9e9),
    };

    const filteredAndSorted = useMemo(() => {
        let arr = recipes.filter(baseFilter);
        if (query) {
            arr = arr.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()));
        }
        arr.sort(sortFns[sortBy] || sortFns.relevance);
        return arr;
    }, [query, filters, sortBy, recipes]);

    function addBreakfast(id: string) {
        setBreakfastList((p) => (p.includes(id) ? p : [...p, id]));
    }

    function addMain(id: string) {
        setMainList((p) => (p.includes(id) ? p : [...p, id]));
    }

    function removeFromBreakfast(id: string) {
        setBreakfastList((p) => p.filter((x) => x !== id));
    }

    function removeFromMain(id: string) {
        setMainList((p) => p.filter((x) => x !== id));
    }

    function saveCurrentToHistory() {
        setSavedMenus((prev) => {
            const existingIdx = prev.findIndex((m) => m.week === weekLabel);
            const slug = slugify(weekLabel);
            const entry = {week: weekLabel, breakfastIds: breakfastList, mainIds: mainList, isPublic: false, slug};
            if (existingIdx >= 0) {
                const copy = [...prev];
                copy[existingIdx] = {
                    ...entry,
                    isPublic: prev[existingIdx].isPublic,
                    slug: prev[existingIdx].slug || slug
                };
                return copy;
            }
            return [entry, ...prev];
        });
    }

    function loadFromHistory(week: string) {
        const found = savedMenus.find((m) => m.week === week);
        if (!found) return;
        setBreakfastList(found.breakfastIds);
        setMainList(found.mainIds);
        setWeekLabel(week);
        setActiveTab("planner");
    }

    function togglePublic(week: string, val: boolean) {
        setSavedMenus((prev) => prev.map((m) => (m.week === week ? {...m, isPublic: val} : m)));
    }

    function applyDates() {
        if (!weekStart || !weekEnd) return;
        const label = formatWeekLabel(weekStart, weekEnd);
        setWeekLabel(label);
        setActiveTab("planner");
    }

    async function generateGroceries() {
        const allIds = [...breakfastList, ...mainList].map(Number);
        if (allIds.length === 0) return;
        setIsGeneratingGroceries(true);
        setActiveTab("grocery");
        try {
            const items = await generateGroceryList(allIds);
            setGroceries(items);
            setRemovedIngredientIds(new Set());
        } finally {
            setIsGeneratingGroceries(false);
        }
    }

    function removeGroceryItem(ingredientId: number) {
        setRemovedIngredientIds(prev => new Set(prev).add(ingredientId));
    }

    function resetGroceryRemovals() {
        setRemovedIngredientIds(new Set());
    }

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <TooltipProvider>
            <div className="min-h-[90vh] w-full bg-gradient-to-b from-white to-slate-50">
                {/* Top App Bar */}
                <div className="sticky top-0 z-30 backdrop-blur bg-white/80 border-b">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
                        <Utensils className="h-6 w-6"/>
                        <div className="font-semibold">MyMealPrep</div>
                        <div className="ml-4 hidden md:flex items-center gap-2">
                            <Badge variant="secondary" className="rounded-full">
                                {weekLabel}
                            </Badge>
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-2"
                                onClick={() => {
                                    const breakfasts = recipes.filter((r) => r.tags.includes("breakfast"));
                                    const mains = recipes.filter((r) => !r.tags.includes("breakfast"));
                                    setBreakfastList(pickRandom(breakfasts.length ? breakfasts : recipes, 2).map((r) => r.id));
                                    setMainList(pickRandom(mains.length ? mains : recipes, 6).map((r) => r.id));
                                }}
                            >
                                <Sparkles className="h-4 w-4"/> Smart Fill
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-2"
                                onClick={() => {
                                    setBreakfastList((p) => pickRandom(p, p.length));
                                    setMainList((p) => pickRandom(p, p.length));
                                }}
                            >
                                <Shuffle className="h-4 w-4"/> Shuffle
                            </Button>
                        </div>

                        {/* Right side: avatar */}
                        <div className="ml-auto flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="gap-2">
                                        <Avatar className="h-7 w-7">
                                            <AvatarFallback>{user?.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                                        </Avatar>
                                        <span className="hidden sm:block text-sm">{user?.email || "User"}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Signed in as {user?.email}</DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Settings</DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    {/* Tabs */}
                    <div className="border-t">
                        <div className="max-w-7xl mx-auto px-4">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList>
                                    <TabsTrigger value="planner" className="gap-2">
                                        <CalendarDays className="h-4 w-4"/> Planner
                                    </TabsTrigger>
                                    <TabsTrigger value="recipes" className="gap-2">
                                        <NotebookPen className="h-4 w-4"/> Recipes
                                    </TabsTrigger>
                                    <TabsTrigger value="history" className="gap-2">
                                        <LinkIcon className="h-4 w-4"/> History
                                    </TabsTrigger>
                                    <TabsTrigger value="grocery" className="gap-2">
                                        <ShoppingCart className="h-4 w-4"/> Grocery
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto p-4">
                    {/* Planner */}
                    {activeTab === "planner" && (
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 lg:col-span-7 space-y-2">
                                <SectionTitle title="Plan a new week"/>
                                <p className="text-xs text-muted-foreground">Fill buckets with your favorite recipes.
                                    Drag, drop, and you're done.</p>

                                <Separator/>

                                <SectionTitleWithIcon icon={Sandwich} title="Breakfast"/>
                                <BucketList ids={breakfastList} recipes={recipes} onRemove={(id) => removeFromBreakfast(id)}/>

                                <Separator/>

                                <SectionTitleWithIcon icon={Utensils} title="Lunch + Dinner"/>
                                <BucketList ids={mainList} recipes={recipes} onRemove={(id) => removeFromMain(id)}/>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    <Button className="gap-2" onClick={generateGroceries}>
                                        <ShoppingCart className="h-4 w-4"/> Create Grocery List
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setBreakfastList([]);
                                            setMainList([]);
                                        }}
                                    >
                                        Clear week
                                    </Button>
                                    <Button variant="outline" onClick={saveCurrentToHistory}>
                                        Save to history
                                    </Button>
                                </div>
                            </div>

                            {/* Right: Add Recipes Panel */}
                            <div className="col-span-12 lg:col-span-5 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Input placeholder="Search recipes..." value={query}
                                           onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                                           className="flex-1"/>
                                    <Button size="sm" variant="outline" onClick={() => setFsOpen(true)}>
                                        <Filter className="h-4 w-4"/>
                                    </Button>
                                </div>

                                <ScrollArea className="h-[600px]">
                                    <div className="space-y-2 pr-4">
                                        {isLoadingRecipes ? (
                                            <p className="text-sm text-muted-foreground py-4">Loading recipes...</p>
                                        ) : recipesError ? (
                                            <p className="text-sm text-destructive py-4">Failed to load recipes.</p>
                                        ) : filteredAndSorted.map((r) => (
                                            <RecipeRow key={r.id} recipe={r} onAddBreakfast={addBreakfast}
                                                       onAddMain={addMain} onIngredientsLoaded={handleIngredientsLoaded}/>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    )}

                    {/* Recipes Tab */}
                    {activeTab === "recipes" && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <SectionTitle title="All Recipes"/>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4"/> New Recipe
                                </Button>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <Input placeholder="Search recipes..." value={query}
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                                       className="flex-1"/>
                                <Button size="sm" variant="outline" onClick={() => setFsOpen(true)}>
                                    <Filter className="h-4 w-4"/>
                                </Button>
                            </div>
                            {isLoadingRecipes ? (
                                <p className="text-sm text-muted-foreground py-4">Loading recipes...</p>
                            ) : recipesError ? (
                                <p className="text-sm text-destructive py-4">Failed to load recipes.</p>
                            ) : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredAndSorted.map((r) => (
                                        <RecipeRow key={r.id} recipe={r} onAddBreakfast={addBreakfast}
                                                   onAddMain={addMain} onIngredientsLoaded={handleIngredientsLoaded}/>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === "history" && (
                        <div>
                            <div className="mb-6">
                                <SectionTitle title="Saved Menus"/>
                                <Card className="mt-4">
                                    <CardContent className="p-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium">Week starts</label>
                                                <Input type="date" value={weekStart}
                                                       onChange={(e: ChangeEvent<HTMLInputElement>) => setWeekStart(e.target.value)}/>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Week ends</label>
                                                <Input type="date" value={weekEnd}
                                                       onChange={(e: ChangeEvent<HTMLInputElement>) => setWeekEnd(e.target.value)}/>
                                            </div>
                                        </div>
                                        <Button className="mt-4" onClick={applyDates}>
                                            Apply dates
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            <div>
                                {/*<SectionTitleWithIcon icon={LinkIcon} title="Saved Menus" />*/}
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                    {savedMenus.map((m) => (
                                        <HistoryCardLarge key={`hist-tab-${m.week}`} menu={m}
                                                          recipes={recipes}
                                                          publicUrl={publicUrlHelper(m.slug)}
                                                          onTogglePublic={togglePublic} onLoad={loadFromHistory}/>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Grocery List */}
                    {activeTab === "grocery" && (
                        <div className="grid lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center justify-between">
                                    <SectionTitle title="Grocery List (auto-grouped)"/>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={resetGroceryRemovals}>
                                            Reset removals
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            Print
                                        </Button>
                                        <Button size="sm">Share</Button>
                                    </div>
                                </div>
                                {isGeneratingGroceries ? (
                                    <p className="text-sm text-muted-foreground py-4">Generating grocery list...</p>
                                ) : groceries.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic py-4">No items yet. Add recipes to your planner and click Create Grocery List.</p>
                                ) : (() => {
                                    const visible = groceries.filter(item => !removedIngredientIds.has(item.ingredientId));
                                    const categories = [...new Set(visible.map(item => item.ingredient.category || 'Other'))];
                                    return categories.map(cat => (
                                        <DepartmentList
                                            key={cat}
                                            name={cat}
                                            items={visible.filter(item => (item.ingredient.category || 'Other') === cat)}
                                            onRemove={removeGroceryItem}
                                        />
                                    ));
                                })()}
                            </div>
                            <div className="space-y-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Add custom item</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex gap-2">
                                        <Input placeholder="e.g., Paper towels"/>
                                        <Button>Add</Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>

                {/* Filter/Sort Sheet */}
                <Sheet open={fsOpen} onOpenChange={setFsOpen}>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Filter & Sort</SheetTitle>
                            <SheetDescription>Refine your recipe list</SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 space-y-6">
                            <div>
                                <h3 className="font-medium mb-3">Filters</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Checkbox checked={filters.breakfast}
                                                  onCheckedChange={(v) => setFilters((p) => ({...p, breakfast: !!v}))}/>
                                        <span className="text-sm">Breakfast</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox checked={filters.vegetarian}
                                                  onCheckedChange={(v) => setFilters((p) => ({
                                                      ...p,
                                                      vegetarian: !!v
                                                  }))}/>
                                        <span className="text-sm">Vegetarian</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox checked={filters.liked}
                                                  onCheckedChange={(v) => setFilters((p) => ({...p, liked: !!v}))}/>
                                        <span className="text-sm">Liked only</span>
                                    </div>
                                </div>
                            </div>

                            <Separator/>

                            <div>
                                <h3 className="font-medium mb-3">Sort by</h3>
                                <div className="space-y-2">
                                    <Chip active={sortBy === "relevance"} onClick={() => setSortBy("relevance")}>
                                        Relevance
                                    </Chip>
                                    <Chip active={sortBy === "ratingDesc"} onClick={() => setSortBy("ratingDesc")}>
                                        Rating
                                    </Chip>
                                    <Chip active={sortBy === "recency"} onClick={() => setSortBy("recency")}>
                                        Recently cooked
                                    </Chip>
                                </div>
                            </div>
                        </div>
                        <SheetFooter className="mt-6">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setFilters({breakfast: false, vegetarian: false, liked: false});
                                    setSortBy("relevance");
                                }}
                            >
                                Reset
                            </Button>
                            <Button onClick={() => setFsOpen(false)}>Apply</Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </TooltipProvider>
    );
}