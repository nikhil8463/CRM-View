import { useQuery } from '@tanstack/react-query'
import campaignService from '@/services/campaignService'

/**
 * Hook to fetch campaign analytics
 * @param {string|number} campaignId - The campaign ID
 * @returns {Object} React Query result with analytics data
 */
export function useCampaignAnalytics(campaignId) {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'analytics'],
    queryFn: () => campaignService.getCampaignAnalytics(campaignId),
    enabled: !!campaignId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}
