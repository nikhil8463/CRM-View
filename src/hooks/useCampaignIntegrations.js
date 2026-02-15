import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import campaignIntegrationService from '@/services/campaignIntegrationService'

// Get all campaign integrations
export function useCampaignIntegrations(campaignId) {
  return useQuery({
    queryKey: ['campaign-integrations', campaignId],
    queryFn: () => campaignIntegrationService.getCampaignIntegrations(campaignId),
    enabled: !!campaignId,
  })
}

// Get specific campaign integration
export function useCampaignIntegration(campaignId, integrationType) {
  return useQuery({
    queryKey: ['campaign-integration', campaignId, integrationType],
    queryFn: () => campaignIntegrationService.getCampaignIntegration(campaignId, integrationType),
    enabled: !!campaignId && !!integrationType,
  })
}

// Update campaign integration
export function useUpdateCampaignIntegration() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ campaignId, integrationType, data }) =>
      campaignIntegrationService.updateCampaignIntegration(campaignId, integrationType, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['campaign-integrations', variables.campaignId] })
      queryClient.invalidateQueries({ queryKey: ['campaign-integration', variables.campaignId, variables.integrationType] })
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.campaignId] })
    },
  })
}

// Delete campaign integration
export function useDeleteCampaignIntegration() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ campaignId, integrationType }) =>
      campaignIntegrationService.deleteCampaignIntegration(campaignId, integrationType),
    onSuccess: (_, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['campaign-integrations', variables.campaignId] })
      queryClient.invalidateQueries({ queryKey: ['campaign-integration', variables.campaignId, variables.integrationType] })
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.campaignId] })
    },
  })
}
