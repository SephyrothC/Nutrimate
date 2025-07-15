import { create } from 'zustand'
import { menuService } from '@/services/menuService'
import toast from 'react-hot-toast'

export const useMenuStore = create((set, get) => ({
    menus: [],
    currentMenu: null,
    isLoading: false,
    isGenerating: false,

    loadMenus: async () => {
        set({ isLoading: true })
        try {
            const menus = await menuService.getMenus()
            set({ menus, isLoading: false })
        } catch (error) {
            toast.error('Erreur lors du chargement des menus')
            set({ isLoading: false })
        }
    },

    generateMenu: async (generateData) => {
        set({ isGenerating: true })
        try {
            const newMenu = await menuService.generateMenu(generateData)
            set(state => ({
                menus: [...state.menus, newMenu],
                currentMenu: newMenu,
                isGenerating: false
            }))
            toast.success('Menu hebdomadaire généré!')
            return newMenu
        } catch (error) {
            const message = error.response?.data?.detail || 'Erreur lors de la génération du menu'
            toast.error(message)
            set({ isGenerating: false })
            return null
        }
    },

    loadMenuDetails: async (menuId) => {
        set({ isLoading: true })
        try {
            const menuDetails = await menuService.getMenuDetails(menuId)
            set({ currentMenu: menuDetails, isLoading: false })
            return menuDetails
        } catch (error) {
            toast.error('Menu introuvable')
            set({ isLoading: false })
            return null
        }
    },

    updateMenu: async (menuId, menuData) => {
        try {
            const updatedMenu = await menuService.updateMenu(menuId, menuData)
            set(state => ({
                menus: state.menus.map(m => m.id === menuId ? updatedMenu : m),
                currentMenu: state.currentMenu?.id === menuId ? updatedMenu : state.currentMenu
            }))
            toast.success('Menu mis à jour!')
            return updatedMenu
        } catch (error) {
            toast.error('Erreur lors de la mise à jour')
            return null
        }
    },

    clearCurrentMenu: () => {
        set({ currentMenu: null })
    }
}))