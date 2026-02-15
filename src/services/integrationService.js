import apiClient from './apiClient'

export const integrationService = {
  // Get all integrations
  getAll: async (params = {}) => {
    const response = await apiClient.get('/integrations', { params })
    return response.data
  },

  // Get single integration by type
  getByType: async (type) => {
    const response = await apiClient.get(`/integrations/${type}`)
    return response.data
  },

  // Update integration configuration
  update: async (type, configData) => {
    const response = await apiClient.put(`/integrations/${type}`, configData)
    return response.data
  },

  // Test integration connection
  testConnection: async (type) => {
    const response = await apiClient.post(`/integrations/${type}/test`)
    return response.data
  },
}

export default integrationService
