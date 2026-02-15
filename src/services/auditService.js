import apiClient from './apiClient'

export const auditService = {
  // Get all audit logs with filters
  getAll: async (params = {}) => {
    const response = await apiClient.get('/audit-logs', { params })
    return response.data
  },

  // Get audit logs for specific model
  getByModel: async (modelType, modelId, params = {}) => {
    const response = await apiClient.get(`/audit-logs/model/${modelType}/${modelId}`, { params })
    return response.data
  },

  // Get audit logs for specific user
  getByUser: async (userId, params = {}) => {
    const response = await apiClient.get(`/audit-logs/user/${userId}`, { params })
    return response.data
  },
}

export default auditService
