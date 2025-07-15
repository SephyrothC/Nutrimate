import { create } from 'zustand'
import { recipeService } from '@/services/recipeService'
import toast from 'react-hot-toast'

export const useRecipeStore = create((set, get) => ({
    recipes: [],
    generatedRecipes: [],
    currentRecipe: null,
    isLoading: false,
    filters: {
        mealType: null,
        isFavorite: null,
        search: ''
    },

    setFilters: (newFilters) => {
        set(state => ({
            filters: { ...state.filters, ...newFilters }
        }))
        get().loadRecipes()
    },

    loadRecipes: async () => {
        set({ isLoading: true })
        try {
            const { mealType, isFavorite } = get().filters
            const params = {}
            if (mealType) params.meal_type = mealType
            if (isFavorite !== null) params.is_favorite = isFavorite

            const recipes = await recipeService.getRecipes(params)
            set({ recipes, isLoading: false })
        } catch (error) {
            toast.error('Erreur lors du chargement des recettes')
            set({ isLoading: false })
        }
    },

    generateRecipes: async (generateData) => {
        set({ isLoading: true })
        try {
            const generatedRecipes = await recipeService.generateRecipes(generateData)
            set({ generatedRecipes, isLoading: false })
            toast.success(`${generatedRecipes.length} recette(s) générée(s)!`)
            return generatedRecipes
        } catch (error) {
            const message = error.response?.data?.detail || 'Erreur lors de la génération'
            toast.error(message)
            set({ isLoading: false })
            return []
        }
    },

    saveRecipe: async (recipeData) => {
        try {
            const newRecipe = await recipeService.createRecipe(recipeData)
            set(state => ({
                recipes: [...state.recipes, newRecipe]
            }))
            toast.success('Recette sauvegardée!')
            return newRecipe
        } catch (error) {
            const message = error.response?.data?.detail || 'Erreur lors de la sauvegarde'
            toast.error(message)
            return null
        }
    },

    loadRecipe: async (recipeId) => {
        set({ isLoading: true })
        try {
            const recipe = await recipeService.getRecipe(recipeId)
            set({ currentRecipe: recipe, isLoading: false })
            return recipe
        } catch (error) {
            toast.error('Recette introuvable')
            set({ isLoading: false })
            return null
        }
    },

    updateRecipe: async (recipeId, recipeData) => {
        try {
            const updatedRecipe = await recipeService.updateRecipe(recipeId, recipeData)
            set(state => ({
                recipes: state.recipes.map(r => r.id === recipeId ? updatedRecipe : r),
                currentRecipe: state.currentRecipe?.id === recipeId ? updatedRecipe : state.currentRecipe
            }))
            toast.success('Recette mise à jour!')
            return updatedRecipe
        } catch (error) {
            toast.error('Erreur lors de la mise à jour')
            return null
        }
    },

    deleteRecipe: async (recipeId) => {
        try {
            await recipeService.deleteRecipe(recipeId)
            set(state => ({
                recipes: state.recipes.filter(r => r.id !== recipeId)
            }))
            toast.success('Recette supprimée!')
            return true
        } catch (error) {
            toast.error('Erreur lors de la suppression')
            return false
        }
    },

    toggleFavorite: async (recipeId) => {
        try {
            const updatedRecipe = await recipeService.toggleFavorite(recipeId)
            set(state => ({
                recipes: state.recipes.map(r => r.id === recipeId ? updatedRecipe : r)
            }))
            const message = updatedRecipe.is_favorite ? 'Ajouté aux favoris' : 'Retiré des favoris'
            toast.success(message)
            return updatedRecipe
        } catch (error) {
            toast.error('Erreur lors de la mise à jour')
            return null
        }
    },

    clearGenerated: () => {
        set({ generatedRecipes: [] })
    }
}))