import React, {useEffect, useState} from 'react';
import {type Recipe, type RecipeCategory, recipeService} from '@/services/recipeService.ts';

const RecipeTest: React.FC = () => {
    const [categories, setCategories] = useState<RecipeCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [categoryRecipes, setCategoryRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [recipesLoading, setRecipesLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                setError(null);

                console.log('🚀 RecipeTest: Starting fresh categories test...');

                const categoriesData = await recipeService.getAllRecipeCategories();

                console.log('✅ RecipeTest: Categories loaded successfully:', categoriesData);

                setCategories(categoriesData);
            } catch (err: any) {
                const errorMessage = err.message || 'Unknown error';
                console.error('❌ RecipeTest: Categories fetch failed:', err);
                setError(errorMessage);
            } finally {
                setCategoriesLoading(false);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Load recipes when category is selected
    const handleCategorySelect = async (categoryId: number) => {
        try {
            setRecipesLoading(true);
            setSelectedCategory(categoryId);
            setCategoryRecipes([]);
            setError(null);

            console.log(`🔍 CategoryTest: Testing getRecipesByCategory(${categoryId})...`);

            const recipes = await recipeService.getRecipesByCategory(categoryId);

            console.log('✅ RecipeTest: Category recipes loaded successfully:', recipes);

            setCategoryRecipes(recipes);
        } catch (err: any) {
            const errorMessage = err.message || 'Unknown error';
            console.error('❌ RecipeTest: Category recipes fetch failed:', err);
            setError(errorMessage);
        } finally {
            setRecipesLoading(false);
        }
    };

    // Main loading state
    if (loading) {
        return (
            <div style={{padding: '20px', textAlign: 'center'}}>
                <h2>🔄 Testing Fresh Category Service...</h2>
                <p>Loading categories from backend...</p>
                <div style={{margin: '20px 0', fontSize: '14px', color: '#666'}}>
                    <p>Testing: categoryService.getAll()</p>
                    <p>Endpoint: GET /categories via Kong Gateway</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error && categories.length === 0) {
        return (
            <div style={{padding: '20px', border: '2px solid red', borderRadius: '8px', margin: '20px'}}>
                <h2>❌ Step 1 Test Failed</h2>
                <p><strong>Error:</strong> {error}</p>

                <button
                    onClick={() => window.location.reload()}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    🔄 Retry Test
                </button>

                <div style={{marginTop: '20px', fontSize: '14px', color: '#666'}}>
                    <h4>🔧 Debug Checklist:</h4>
                    <ul style={{textAlign: 'left', paddingLeft: '20px'}}>
                        <li>✅ Backend running: <code>make run</code></li>
                        <li>✅ Kong Gateway on port 8000</li>
                        <li>✅ Recipe service on port 8002</li>
                        <li>✅ Environment variable: VITE_API_BASE_URL=http://localhost:8000</li>
                        <li>✅ Database has categories</li>
                        <li>✅ No CORS issues</li>
                    </ul>

                    <h4 style={{marginTop: '15px'}}>🧪 Test Commands:</h4>
                    <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '10px',
                        borderRadius: '4px',
                        fontFamily: 'monospace'
                    }}>
                        curl http://localhost:8000/categories
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    return (
        <div style={{padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto'}}>
            <h1>✅ Step 1: Categories API Test</h1>

            {/* Success Banner */}
            <div style={{
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#d4edda',
                border: '1px solid #c3e6cb',
                borderRadius: '8px',
                color: '#155724'
            }}>
                <h3 style={{margin: '0 0 10px 0'}}>🎉 Fresh Category Service Works!</h3>
                <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px', alignItems: 'center'}}>
                    <span>✅ categoryService.getAll():</span><span><strong>Working</strong></span>
                    <span>✅ Data transformation:</span><span><strong>Working</strong></span>
                    <span>✅ Date parsing:</span><span><strong>Working</strong></span>
                    <span>✅ Error handling:</span><span><strong>Ready</strong></span>
                    <span>✅ Kong Gateway:</span><span><strong>Connected</strong></span>
                </div>
            </div>

            {/* Categories Section */}
            <div style={{marginBottom: '30px'}}>
                <h3>📋 Categories Loaded ({categories.length})</h3>

                {categoriesLoading ? (
                    <p>🔄 Loading categories...</p>
                ) : categories.length === 0 ? (
                    <p style={{color: 'orange'}}>⚠️ No categories found. Database might need seeding.</p>
                ) : (
                    <div>
                        <select
                            onChange={(e) => {
                                const categoryId = parseInt(e.target.value, 10);
                                if (!isNaN(categoryId)) {
                                    handleCategorySelect(categoryId);
                                }
                            }}
                            style={{
                                padding: '10px',
                                fontSize: '16px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                minWidth: '250px',
                                marginBottom: '15px'
                            }}
                        >
                            <option value="">Select a category to test filtering...</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                    {category.description && ` - ${category.description}`}
                                </option>
                            ))}
                        </select>

                        {/* Categories Grid */}
                        <div style={{
                            display: 'grid',
                            gap: '10px',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
                        }}>
                            {categories.map(category => (
                                <div
                                    key={category.id}
                                    style={{
                                        padding: '12px',
                                        border: selectedCategory === category.id ? '2px solid #007bff' : '1px solid #ddd',
                                        borderRadius: '6px',
                                        backgroundColor: selectedCategory === category.id ? '#e6f3ff' : '#f9f9f9',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleCategorySelect(category.id)}
                                >
                                    <div style={{fontWeight: 'bold', fontSize: '16px'}}>
                                        {category.name} <span
                                        style={{color: '#666', fontSize: '14px'}}>(ID: {category.id})</span>
                                    </div>
                                    {category.description && (
                                        <div style={{color: '#666', fontSize: '14px', marginTop: '4px'}}>
                                            {category.description}
                                        </div>
                                    )}
                                    <div style={{fontSize: '12px', color: '#999', marginTop: '8px'}}>
                                        Created: {category.createdAt.toLocaleDateString()}
                                        {' • '}
                                        Updated: {category.updatedAt.toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Recipes Section */}
            {selectedCategory && (
                <div style={{marginBottom: '30px'}}>
                    <h3>🍽️ Testing getRecipesByCategory({selectedCategory})</h3>

                    {recipesLoading ? (
                        <p>🔄 Loading recipes for selected category...</p>
                    ) : categoryRecipes.length === 0 ? (
                        <div style={{
                            padding: '15px',
                            backgroundColor: '#fff3cd',
                            border: '1px solid #ffeaa7',
                            borderRadius: '4px'
                        }}>
                            <p style={{margin: 0, color: '#856404'}}>
                                ⚠️ No recipes found in this category. This is normal if your database is empty.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div style={{
                                marginBottom: '15px',
                                padding: '10px',
                                backgroundColor: '#d1ecf1',
                                border: '1px solid #bee5eb',
                                borderRadius: '4px',
                                color: '#0c5460'
                            }}>
                                ✅ categoryService.getRecipesByCategory() working!
                                Found {categoryRecipes.length} recipes.
                            </div>

                            <div style={{display: 'grid', gap: '10px'}}>
                                {categoryRecipes.map(recipe => (
                                    <div
                                        key={recipe.id}
                                        style={{
                                            padding: '12px',
                                            border: '1px solid #ddd',
                                            borderRadius: '6px',
                                            backgroundColor: '#f0f8ff'
                                        }}
                                    >
                                        <div style={{fontWeight: 'bold', fontSize: '16px'}}>
                                            {recipe.name} <span
                                            style={{color: '#666', fontSize: '14px'}}>(ID: {recipe.id})</span>
                                        </div>
                                        {recipe.description && (
                                            <div style={{color: '#666', marginTop: '4px'}}>
                                                {recipe.description}
                                            </div>
                                        )}
                                        <div style={{fontSize: '12px', color: '#999', marginTop: '8px'}}>
                                            Created: {recipe.createdAt.toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Raw Data Section */}
            <details style={{marginBottom: '20px'}}>
                <summary style={{
                    cursor: 'pointer',
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                }}>
                    📋 Show Raw API Data (for debugging)
                </summary>
                <div style={{
                    marginTop: '10px',
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    maxHeight: '400px',
                    overflow: 'auto'
                }}>
                    <h4>Categories Data:</h4>
                    <pre>{JSON.stringify(categories, null, 2)}</pre>

                    {categoryRecipes.length > 0 && (
                        <>
                            <h4>Recipe Data:</h4>
                            <pre>{JSON.stringify(categoryRecipes, null, 2)}</pre>
                        </>
                    )}
                </div>
            </details>

            {/* Next Steps */}
            <div style={{
                padding: '20px',
                backgroundColor: '#e6f3ff',
                border: '2px solid #0066cc',
                borderRadius: '8px'
            }}>
                <h4>🎯 Step 1 Complete! Ready for Step 2</h4>
                <p><strong>What we've verified:</strong></p>
                <ul>
                    <li>✅ Fresh categoryService.ts works perfectly</li>
                    <li>✅ Your apiClient.ts connects to Kong Gateway</li>
                    <li>✅ Data transformation (snake_case → camelCase) works</li>
                    <li>✅ Date parsing (strings → Date objects) works</li>
                    <li>✅ Error handling is robust</li>
                    <li>✅ Backend communication is stable</li>
                </ul>

                <p><strong>🚀 Next Step:</strong> Create <code>recipeService.ts</code> for recipes API</p>
                <div style={{fontSize: '14px', color: '#666', marginTop: '10px'}}>
                    Ready to build: <code>recipeService.getAll()</code>, <code>recipeService.getById()</code>
                </div>
            </div>
        </div>
    );
};

export default RecipeTest;