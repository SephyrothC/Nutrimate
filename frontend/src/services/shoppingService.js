import api from './api'

export const shoppingService = {
    async getShoppingLists() {
        const response = await api.get('/api/shopping/')
        return response.data
    },

    async generateShoppingList(menuId) {
        const response = await api.post('/api/shopping/generate', { menu_id: menuId })
        return response.data
    },

    async updateShoppingItem(shoppingListId, itemIndex, updateData) {
        const response = await api.put(
            `/api/shopping/${shoppingListId}/items/${itemIndex}`,
            updateData
        )
        return response.data
    },

    async exportToPDF(shoppingListId) {
        const response = await api.get(`/api/shopping/${shoppingListId}/export`, {
            responseType: 'blob'
        })

        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `liste_courses_${shoppingListId}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
    }
}
