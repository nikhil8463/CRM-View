import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      
      // Handle authentication errors
      if (status === 401) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
        toast.error('Session expired. Please login again.')
      }
      
      // Handle validation errors
      if (status === 422) {
        const errors = data.errors
        if (errors) {
          Object.values(errors).flat().forEach(err => toast.error(err))
        }
      }
      
      // Handle server errors
      if (status >= 500) {
        toast.error('Server error. Please try again later.')
      }
      
      // Handle other errors
      if (data.message) {
        toast.error(data.message)
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.')
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
