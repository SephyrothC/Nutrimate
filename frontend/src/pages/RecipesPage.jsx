import React, { useEffect, useState } from 'react'
import { useRecipeStore } from '@/stores/recipeStore'
import RecipeGrid from '@/components/recipes/RecipeGrid'
import RecipeFilters from '@/components/recipes/RecipeFilters'
import RecipeDetail from '@/components/recipes/RecipeDetail'
import { Plus } from 'lucide-react'
import Button from '@/components/common/Button'
import { ROUTES } from '@/utils/constants'
import { Link } from 'react-router-dom'

const RecipesPage = () => {
    const {
        recipes,
        filters,
        isLoading,
        loadRecipes,
        setFilters,
        toggleFavorite,
        deleteRecipe
    } = useRecipeStore()

    const [selectedRecipe, setSelectedRecipe] = useState(null)

    useEffect(() => {
        loadRecipes()
    }, [loadRecipes])

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters)
    }

    const handleClearFilters = () => {
        setFilters({
            mealType: null,
            isFavorite: null,
            search: ''
        })
    }

    const filteredRecipes = recipes.filter(recipe => {
        if (filters.search && !recipe.title.toLowerCase().includes(filters.search.toLowerCase())) {
            return false
        }
        return true
    })

    if (selectedRecipe) {
        return (
            <RecipeDetail
                recipe={selectedRecipe}
                onBack={() => setSelectedRecipe(null)}
                onToggleFavorite={toggleFavorite}
            />
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Mes Recettes</h1>
                    <p className="text-gray-400 mt-1">
                        Gérez votre bibliothèque de recettes personnalisées
                    </p>
                </div>

                <Link to={ROUTES.GENERATE}>
                    <Button variant="primary">
                        <Plus className="w-5 h-5 mr-2" />
                        Nouvelles recettes
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <RecipeFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
            />

            {/* Recipes Grid */}
            <RecipeGrid
                recipes={filteredRecipes}
                isLoading={isLoading}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteRecipe}
                onView={setSelectedRecipe}
                emptyTitle="Aucune recette trouvée"
                emptyDescription="Essayez de modifier vos filtres ou créez votre première recette"
            />
        </div>
    )
}

export default RecipesPage