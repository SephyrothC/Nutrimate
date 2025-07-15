import api from './api'

export const authService = {
    async register(userData) {
        const response = await api.post('/api/auth/register', userData)
        return response.data
    },

    async login(credentials) {
        const response = await api.post('/api/auth/login', credentials)
        const { access_token } = response.data

        if (access_token) {
            localStorage.setItem('access_token', access_token)
        }

        return response.data
    },

    async getProfile() {
        const response = await api.get('/api/auth/me')
        return response.data
    },

    async updateProfile(userData) {
        const response = await api.put('/api/auth/profile', userData)
        return response.data
    },

    logout() {
        localStorage.removeItem('access_token')
        window.location.href = '/login'
    },

    isAuthenticated() {
        return !!localStorage.getItem('access_token')
    }
}