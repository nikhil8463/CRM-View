import apiClient from './apiClient'

export const roleService = {
  // Get all roles
  getAll: async (params = {}) => {
    const response = await apiClient.get('/roles', { params })
    return response.data
  },

  // Get single role by ID
  getById: async (id) => {
    const response = await apiClient.get(`/roles/${id}`)
    return response.data
  },

  // Create new role
  create: async (roleData) => {
    const response = await apiClient.post('/roles', roleData)
    return response.data
  },

  // Update role
  update: async (id, roleData) => {
    const response = await apiClient.put(`/roles/${id}`, roleData)
    return response.data
  },

  // Delete role
  delete: async (id) => {
    const response = await apiClient.delete(`/roles/${id}`)
    return response.data
  },
}

export default roleService
