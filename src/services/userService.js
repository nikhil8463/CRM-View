import apiClient from './apiClient'

export const userService = {
  // Get all users with filters
  getAll: async (params = {}) => {
    const response = await apiClient.get('/users', { params })
    return response.data
  },

  // Get single user by ID
  getById: async (id) => {
    const response = await apiClient.get(`/users/${id}`)
    return response.data
  },

  // Create new user
  create: async (userData) => {
    const response = await apiClient.post('/users', userData)
    return response.data
  },

  // Update user
  update: async (id, userData) => {
    const response = await apiClient.put(`/users/${id}`, userData)
    return response.data
  },

  // Delete user
  delete: async (id) => {
    const response = await apiClient.delete(`/users/${id}`)
    return response.data
  },

  // Toggle user status (active/inactive)
  toggleStatus: async (id) => {
    const response = await apiClient.patch(`/users/${id}/toggle-status`)
    return response.data
  },
}

export default userService
