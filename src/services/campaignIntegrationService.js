import apiClient from './apiClient'

export const campaignIntegrationService = {
  // Get all integrations for a campaign
  getCampaignIntegrations: async (campaignId) => {
    const response = await apiClient.get(`/campaigns/${campaignId}/integrations`)
    return response.data
  },

  // Get specific integration for a campaign
  getCampaignIntegration: async (campaignId, integrationType) => {
    const response = await apiClient.get(`/campaigns/${campaignId}/integrations/${integrationType}`)
    return response.data
  },

  // Update campaign integration
  updateCampaignIntegration: async (campaignId, integrationType, data) => {
    const response = await apiClient.put(`/campaigns/${campaignId}/integrations/${integrationType}`, data)
    return response.data
  },

  // Delete campaign integration (revert to global)
  deleteCampaignIntegration: async (campaignId, integrationType) => {
    const response = await apiClient.delete(`/campaigns/${campaignId}/integrations/${integrationType}`)
    return response.data
  },
}

export default campaignIntegrationService
