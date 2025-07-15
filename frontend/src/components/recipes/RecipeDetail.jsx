import React from 'react'
import { Clock, Users, Heart, Tag, ArrowLeft } from 'lucide-react'
import { formatTime, getMealTypeIcon } from '@/utils/helpers'
import { MEAL_TYPE_LABELS } from '@/utils/constants'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import Card from '@/components/common/Card'

const RecipeDetail = ({ recipe, onBack, onToggleFavorite, onEdit }) => {
    if (!recipe) return null

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </Button>

                <div className="flex space-x-2">
                    {onToggleFavorite && (
                        <Button
                            variant={recipe.is_favorite ? "danger" : "secondary"}
                            onClick={() => onToggleFavorite(recipe.id)}
                        >
                            <Heart className={`w-4 h-4 mr-2 ${recipe.is_favorite ? 'fill-current' : ''}`} />
                            {recipe.is_favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        </Button>
                    )}

                    {onEdit && (
                        <Button variant="primary" onClick={() => onEdit(recipe)}>
                            Modifier
                        </Button>
                    )}
                </div>
            </div>

            {/* Recipe Info */}
            <Card>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">{getMealTypeIcon(recipe.meal_type)}</span>
                            <Badge variant="primary">
                                {MEAL_TYPE_LABELS[recipe.meal_type]}
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">{recipe.title}</h1>
                    </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
                    {recipe.prep_time && (
                        <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5" />
                            <div>
                                <span className="text-white font-medium">
                                    {formatTime(recipe.prep_time + (recipe.cook_time || 0))}
                                </span>
                                <div className="text-sm">
                                    Préparation: {formatTime(recipe.prep_time)}
                                    {recipe.cook_time && ` • Cuisson: ${formatTime(recipe.cook_time)}`}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span className="text-white font-medium">{recipe.servings} personne{recipe.servings > 1 ? 's' : ''}</span>
                    </div>
                </div>

                {/* Tags */}
                {recipe.tags && recipe.tags.length > 0 && (
                    <div className="flex items-center space-x-2 mb-6">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <div className="flex flex-wrap gap-2">
                            {recipe.tags.map((tag, index) => (
                                <Badge key={index} variant="default">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Ingredients */}
                <Card>
                    <h2 className="text-xl font-semibold text-white mb-4">Ingrédients</h2>
                    <ul className="space-y-2">
                        {recipe.ingredients?.map((ingredient, index) => (
                            <li key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                                <span className="text-gray-300">{ingredient.name}</span>
                                <span className="text-primary-400 font-medium">
                                    {ingredient.quantity} {ingredient.unit}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Card>

                {/* Instructions */}
                <Card>
                    <h2 className="text-xl font-semibold text-white mb-4">Instructions</h2>
                    <ol className="space-y-4">
                        {recipe.steps?.map((step, index) => (
                            <li key={index} className="flex space-x-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white text-sm font-medium rounded-full flex items-center justify-center">
                                    {index + 1}
                                </span>
                                <p className="text-gray-300 leading-relaxed">{step}</p>
                            </li>
                        ))}
                    </ol>
                </Card>
            </div>
        </div>
    )
}

export default RecipeDetail