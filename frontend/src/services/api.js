import axios from 'axios'
import { API_BASE_URL } from '@/utils/constants'
import toast from 'react-hot-toast'

// Configuration axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token')
            window.location.href = '/login'
            toast.error('Session expirée, veuillez vous reconnecter')
        } else if (error.response?.status >= 500) {
            toast.error('Erreur serveur, veuillez réessayer plus tard')
        }
        return Promise.reject(error)
    }
)

export default api
