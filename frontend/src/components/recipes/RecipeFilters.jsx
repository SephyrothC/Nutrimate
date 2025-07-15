import React from 'react'
import { Search, Filter, Heart, X } from 'lucide-react'
import { MEAL_TYPES, MEAL_TYPE_LABELS } from '@/utils/constants'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

const RecipeFilters = ({ filters, onFiltersChange, onClearFilters }) => {
    const handleFilterChange = (key, value) => {
        onFiltersChange({ [key]: value })
    }

    const hasActiveFilters = filters.mealType || filters.isFavorite !== null || filters.search

    return (
        <div className="bg-surface rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <h3 className="font-medium text-white">Filtres</h3>
                </div>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="text-gray-400 hover:text-white"
                    >
                        <X className="w-4 h-4 mr-1" />
                        Effacer
                    </Button>
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {/* Recherche */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une recette..."
                        value={filters.search || ''}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="input pl-10"
                    />
                </div>

                {/* Type de repas */}
                <select
                    value={filters.mealType || ''}
                    onChange={(e) => handleFilterChange('mealType', e.target.value || null)}
                    className="input"
                >
                    <option value="">Tous les types</option>
                    {Object.entries(MEAL_TYPE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>

                {/* Favoris */}
                <select
                    value={filters.isFavorite === null ? '' : filters.isFavorite}
                    onChange={(e) => {
                        const value = e.target.value === '' ? null : e.target.value === 'true'
                        handleFilterChange('isFavorite', value)
                    }}
                    className="input"
                >
                    <option value="">Toutes les recettes</option>
                    <option value="true">Favoris uniquement</option>
                    <option value="false">Non favoris</option>
                </select>
            </div>
        </div>
    )
}

export default RecipeFilters