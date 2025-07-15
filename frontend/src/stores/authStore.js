import { create } from 'zustand'
import { authService } from '@/services/authService'
import toast from 'react-hot-toast'

export const useAuthStore = create((set, get) => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,

    login: async (credentials) => {
        set({ isLoading: true })
        try {
            await authService.login(credentials)
            const user = await authService.getProfile()
            set({ user, isAuthenticated: true, isLoading: false })
            toast.success('Connexion réussie!')
            return true
        } catch (error) {
            const message = error.response?.data?.detail || 'Erreur de connexion'
            toast.error(message)
            set({ isLoading: false })
            return false
        }
    },

    register: async (userData) => {
        set({ isLoading: true })
        try {
            await authService.register(userData)
            toast.success('Inscription réussie! Vous pouvez maintenant vous connecter.')
            set({ isLoading: false })
            return true
        } catch (error) {
            const message = error.response?.data?.detail || 'Erreur lors de l\'inscription'
            toast.error(message)
            set({ isLoading: false })
            return false
        }
    },

    loadUser: async () => {
        if (!authService.isAuthenticated()) {
            set({ isAuthenticated: false })
            return
        }

        set({ isLoading: true })
        try {
            const user = await authService.getProfile()
            set({ user, isAuthenticated: true, isLoading: false })
        } catch (error) {
            authService.logout()
            set({ user: null, isAuthenticated: false, isLoading: false })
        }
    },

    updateProfile: async (userData) => {
        set({ isLoading: true })
        try {
            const updatedUser = await authService.updateProfile(userData)
            set({ user: updatedUser, isLoading: false })
            toast.success('Profil mis à jour!')
            return true
        } catch (error) {
            const message = error.response?.data?.detail || 'Erreur lors de la mise à jour'
            toast.error(message)
            set({ isLoading: false })
            return false
        }
    },

    logout: () => {
        authService.logout()
        set({ user: null, isAuthenticated: false })
        toast.success('Déconnexion réussie')
    }
}))
