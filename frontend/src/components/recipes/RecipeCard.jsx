import React from 'react'
import { Clock, Users, Heart, Trash2, Eye } from 'lucide-react'
import { formatTime, getMealTypeIcon } from '@/utils/helpers'
import { MEAL_TYPE_LABELS } from '@/utils/constants'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'

const RecipeCard = ({
    recipe,
    onToggleFavorite,
    onDelete,
    onView,
    onSave, // Pour les recettes générées
    isGenerated = false
}) => {
    const handleFavoriteClick = (e) => {
        e.stopPropagation()
        onToggleFavorite?.(recipe.id)
    }

    const handleDeleteClick = (e) => {
        e.stopPropagation()
        onDelete?.(recipe.id)
    }

    const handleSaveClick = (e) => {
        e.stopPropagation()
        onSave?.(recipe)
    }

    return (
        <Card hover onClick={() => onView?.(recipe)} className="group">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <span className="text-xl">{getMealTypeIcon(recipe.meal_type)}</span>
                    <Badge variant="primary">
                        {MEAL_TYPE_LABELS[recipe.meal_type]}
                    </Badge>
                </div>

                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isGenerated && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleFavoriteClick}
                                className={`p-1 ${recipe.is_favorite ? 'text-red-400' : 'text-gray-400'}`}
                            >
                                <Heart className={`w-4 h-4 ${recipe.is_favorite ? 'fill-current' : ''}`} />
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDeleteClick}
                                className="p-1 text-gray-400 hover:text-red-400"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView?.(recipe)}
                        className="p-1 text-gray-400 hover:text-primary-400"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2">
                {recipe.title}
            </h3>

            {/* Meta info */}
            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                {recipe.prep_time && (
                    <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(recipe.prep_time + (recipe.cook_time || 0))}</span>
                    </div>
                )}

                <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{recipe.servings} pers.</span>
                </div>
            </div>

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {recipe.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="default" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                    {recipe.tags.length > 3 && (
                        <Badge variant="default" className="text-xs">
                            +{recipe.tags.length - 3}
                        </Badge>
                    )}
                </div>
            )}

            {/* Ingredients preview */}
            <div className="text-sm text-gray-400 mb-4">
                <span className="font-medium">Ingrédients: </span>
                <span>
                    {recipe.ingredients?.slice(0, 3).map(ing => ing.name).join(', ')}
                    {recipe.ingredients?.length > 3 && '...'}
                </span>
            </div>

            {/* Actions for generated recipes */}
            {isGenerated && (
                <div className="pt-3 border-t border-gray-700">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSaveClick}
                        className="w-full"
                    >
                        Sauvegarder cette recette
                    </Button>
                </div>
            )}
        </Card>
    )
}

export default RecipeCard