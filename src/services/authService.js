import apiClient from './apiClient'

export const authService = {
  // Login
  login: async (credentials) => {
    const response = await apiClient.post('/login', credentials)
    return response.data
  },

  // Register
  register: async (userData) => {
    const response = await apiClient.post('/register', userData)
    return response.data
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post('/logout')
    return response.data
  },

  // Get current user
  me: async () => {
    const response = await apiClient.get('/me')
    return response.data
  },
}

export default authService
