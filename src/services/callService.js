import apiClient from './apiClient'

export const callService = {
  // Get all calls
  getCalls: async (params = {}) => {
    const response = await apiClient.get('/calls', { params })
    return response.data
  },

  // Get single call
  getCall: async (id) => {
    const response = await apiClient.get(`/calls/${id}`)
    return response.data
  },

  // Create call
  createCall: async (data) => {
    const response = await apiClient.post('/calls', data)
    return response.data
  },

  // Update call
  updateCall: async (id, data) => {
    const response = await apiClient.put(`/calls/${id}`, data)
    return response.data
  },

  // Delete call
  deleteCall: async (id) => {
    const response = await apiClient.delete(`/calls/${id}`)
    return response.data
  },

  // Get call transcript
  getCallTranscript: async (id) => {
    const response = await apiClient.get(`/calls/${id}/transcripts`)
    return response.data
  },

  // Get call recording
  getCallRecording: async (id) => {
    const response = await apiClient.get(`/calls/${id}/recording`)
    return response.data
  },

  // Get call analytics
  getCallAnalytics: async (id) => {
    const response = await apiClient.get(`/calls/${id}/analytics`)
    return response.data
  },

  // Initiate AI call (Retell AI)
  initiateAICall: async (data) => {
    const response = await apiClient.post('/calls/ai-initiate', data)
    return response.data
  },

  // Get AI call status
  getAICallStatus: async (callId) => {
    const response = await apiClient.get(`/calls/${callId}/ai-status`)
    return response.data
  },
}

export default callService
