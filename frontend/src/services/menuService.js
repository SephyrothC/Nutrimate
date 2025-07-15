import api from './api'

export const menuService = {
    async getMenus() {
        const response = await api.get('/api/menus/')
        return response.data
    },

    async generateMenu(generateData) {
        const response = await api.post('/api/menus/generate', generateData)
        return response.data
    },

    async createMenu(menuData) {
        const response = await api.post('/api/menus/', menuData)
        return response.data
    },

    async getMenuDetails(menuId) {
        const response = await api.get(`/api/menus/${menuId}`)
        return response.data
    },

    async updateMenu(menuId, menuData) {
        const response = await api.put(`/api/menus/${menuId}`, menuData)
        return response.data
    }
}