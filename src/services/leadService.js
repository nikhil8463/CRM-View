import apiClient from './apiClient'

export const leadService = {
  // Get all leads
  getLeads: async (params = {}) => {
    const response = await apiClient.get('/leads', { params })
    return response.data
  },

  // Get single lead
  getLead: async (id) => {
    const response = await apiClient.get(`/leads/${id}`)
    return response.data
  },

  // Create lead
  createLead: async (data) => {
    const response = await apiClient.post('/leads', data)
    return response.data
  },

  // Update lead
  updateLead: async (id, data) => {
    const response = await apiClient.put(`/leads/${id}`, data)
    return response.data
  },

  // Delete lead
  deleteLead: async (id) => {
    const response = await apiClient.delete(`/leads/${id}`)
    return response.data
  },

  // Update lead status
  updateLeadStatus: async (id, status) => {
    const response = await apiClient.patch(`/leads/${id}/status`, { status })
    return response.data
  },

  // Get lead timeline
  getLeadTimeline: async (id) => {
    const response = await apiClient.get(`/leads/${id}/timeline`)
    return response.data
  },

  // Get lead calls
  getLeadCalls: async (id, params = {}) => {
    const response = await apiClient.get(`/leads/${id}/calls`, { params })
    return response.data
  },

  // Get lead communications
  getLeadCommunications: async (id, params = {}) => {
    const response = await apiClient.get(`/leads/${id}/communications`, { params })
    return response.data
  },

  // Get lead tasks
  getLeadTasks: async (id, params = {}) => {
    const response = await apiClient.get(`/leads/${id}/tasks`, { params })
    return response.data
  },

  // Assign lead
  assignLead: async (id, userId) => {
    const response = await apiClient.post(`/leads/${id}/assign`, { user_id: userId })
    return response.data
  },

  // Bulk update leads
  bulkUpdateLeads: async (data) => {
    const response = await apiClient.post('/leads/bulk-update', data)
    return response.data
  },

  // Import leads
  importLeads: async (formData) => {
    const response = await apiClient.post('/leads/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },
}

export default leadService
