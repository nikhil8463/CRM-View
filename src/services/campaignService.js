import apiClient from './apiClient'

export const campaignService = {
  // Get all campaigns
  getCampaigns: async (params = {}) => {
    const response = await apiClient.get('/campaigns', { params })
    return response.data
  },

  // Get single campaign
  getCampaign: async (id) => {
    const response = await apiClient.get(`/campaigns/${id}`)
    return response.data
  },

  // Create campaign
  createCampaign: async (data) => {
    const response = await apiClient.post('/campaigns', data)
    return response.data
  },

  // Update campaign
  updateCampaign: async (id, data) => {
    const response = await apiClient.put(`/campaigns/${id}`, data)
    return response.data
  },

  // Delete campaign
  deleteCampaign: async (id) => {
    const response = await apiClient.delete(`/campaigns/${id}`)
    return response.data
  },

  // Assign users to campaign
  assignUsers: async (id, userIds) => {
    const response = await apiClient.post(`/campaigns/${id}/assign`, {
      user_ids: Array.isArray(userIds) ? userIds : [userIds]
    })
    return response.data
  },

  // Get campaign analytics
  getCampaignAnalytics: async (id) => {
    const response = await apiClient.get(`/campaigns/${id}/analytics`)
    return response.data
  },

  // Get campaign leads
  getCampaignLeads: async (id, params = {}) => {
    const response = await apiClient.get(`/campaigns/${id}/leads`, { params })
    return response.data
  },

  // Activate/Deactivate campaign
  toggleCampaignStatus: async (id) => {
    const response = await apiClient.post(`/campaigns/${id}/toggle-status`)
    return response.data
  },
}

export default campaignService
