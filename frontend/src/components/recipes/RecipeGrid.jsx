import React from 'react'
import RecipeCard from './RecipeCard'
import EmptyState from '@/components/common/EmptyState'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { ChefHat } from 'lucide-react'

const RecipeGrid = ({
    recipes,
    isLoading,
    onToggleFavorite,
    onDelete,
    onView,
    onSave,
    isGenerated = false,
    emptyTitle = "Aucune recette",
    emptyDescription = "Commencez par générer ou créer votre première recette"
}) => {
    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (!recipes || recipes.length === 0) {
        return (
            <EmptyState
                icon={ChefHat}
                title={emptyTitle}
                description={emptyDescription}
            />
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
                <RecipeCard
                    key={isGenerated ? index : recipe.id}
                    recipe={recipe}
                    onToggleFavorite={onToggleFavorite}
                    onDelete={onDelete}
                    onView={onView}
                    onSave={onSave}
                    isGenerated={isGenerated}
                />
            ))}
        </div>
    )
}

export default RecipeGrid