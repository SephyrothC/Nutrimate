import { create } from 'zustand'
import { shoppingService } from '@/services/shoppingService'
import toast from 'react-hot-toast'

export const useShoppingStore = create((set, get) => ({
    shoppingLists: [],
    currentList: null,
    isLoading: false,

    loadShoppingLists: async () => {
        set({ isLoading: true })
        try {
            const lists = await shoppingService.getShoppingLists()
            set({ shoppingLists: lists, isLoading: false })
        } catch (error) {
            toast.error('Erreur lors du chargement des listes')
            set({ isLoading: false })
        }
    },

    generateShoppingList: async (menuId) => {
        set({ isLoading: true })
        try {
            const newList = await shoppingService.generateShoppingList(menuId)
            set(state => ({
                shoppingLists: [...state.shoppingLists, newList],
                currentList: newList,
                isLoading: false
            }))
            toast.success('Liste de courses générée!')
            return newList
        } catch (error) {
            const message = error.response?.data?.detail || 'Erreur lors de la génération'
            toast.error(message)
            set({ isLoading: false })
            return null
        }
    },

    updateItem: async (shoppingListId, itemIndex, updateData) => {
        try {
            const updatedList = await shoppingService.updateShoppingItem(
                shoppingListId,
                itemIndex,
                updateData
            )

            set(state => ({
                shoppingLists: state.shoppingLists.map(list =>
                    list.id === shoppingListId ? updatedList : list
                ),
                currentList: state.currentList?.id === shoppingListId ? updatedList : state.currentList
            }))

            return updatedList
        } catch (error) {
            toast.error('Erreur lors de la mise à jour')
            return null
        }
    },

    exportToPDF: async (shoppingListId) => {
        try {
            await shoppingService.exportToPDF(shoppingListId)
            toast.success('Liste exportée en PDF!')
        } catch (error) {
            toast.error('Erreur lors de l\'export PDF')
        }
    },

    setCurrentList: (list) => {
        set({ currentList: list })
    }
}))