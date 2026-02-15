import apiClient from './apiClient'

export const communicationLogService = {
  // Get communication logs
  getLogs: async (params = {}) => {
    const response = await apiClient.get('/communication-logs', { params })
    return response.data
  },

  // Create communication log
  createLog: async (data) => {
    const response = await apiClient.post('/communication-logs', data)
    return response.data
  },
}

export default communicationLogService
