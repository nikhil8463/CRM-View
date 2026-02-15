import apiClient from './apiClient'

export const aiService = {
  // Get AI insights
  getAIInsights: async (params = {}) => {
    const response = await apiClient.get('/ai/insights', { params })
    return response.data
  },

  // Get AI activity feed
  getAIActivityFeed: async (params = {}) => {
    const response = await apiClient.get('/ai/activity-feed', { params })
    return response.data
  },

  // Get AI model performance
  getModelPerformance: async (params = {}) => {
    const response = await apiClient.get('/ai/model-performance', { params })
    return response.data
  },

  // Get AI recommendations
  getRecommendations: async (context) => {
    const response = await apiClient.post('/ai/recommendations', context)
    return response.data
  },

  // Get lead score
  getLeadScore: async (leadId) => {
    const response = await apiClient.get(`/ai/lead-score/${leadId}`)
    return response.data
  },

  // Get automation rules
  getAutomationRules: async () => {
    const response = await apiClient.get('/ai/automation-rules')
    return response.data
  },

  // Create automation rule
  createAutomationRule: async (data) => {
    const response = await apiClient.post('/ai/automation-rules', data)
    return response.data
  },

  // Update automation rule
  updateAutomationRule: async (id, data) => {
    const response = await apiClient.put(`/ai/automation-rules/${id}`, data)
    return response.data
  },

  // Delete automation rule
  deleteAutomationRule: async (id) => {
    const response = await apiClient.delete(`/ai/automation-rules/${id}`)
    return response.data
  },

  // Trigger AI analysis
  triggerAIAnalysis: async (data) => {
    const response = await apiClient.post('/ai/analyze', data)
    return response.data
  },
}

export default aiService
