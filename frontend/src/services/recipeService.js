import api from './api'

export const recipeService = {
    async getRecipes(params = {}) {
        const response = await api.get('/api/recipes/', { params })
        return response.data
    },

    async generateRecipes(generateData) {
        const response = await api.post('/api/recipes/generate', generateData)
        return response.data
    },

    async createRecipe(recipeData) {
        const response = await api.post('/api/recipes/', recipeData)
        return response.data
    },

    async getRecipe(recipeId) {
        const response = await api.get(`/api/recipes/${recipeId}`)
        return response.data
    },

    async updateRecipe(recipeId, recipeData) {
        const response = await api.put(`/api/recipes/${recipeId}`, recipeData)
        return response.data
    },

    async deleteRecipe(recipeId) {
        const response = await api.delete(`/api/recipes/${recipeId}`)
        return response.data
    },

    async toggleFavorite(recipeId) {
        const response = await api.put(`/api/recipes/${recipeId}/favorite`)
        return response.data
    }
}
