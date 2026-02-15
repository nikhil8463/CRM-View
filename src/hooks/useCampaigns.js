import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import campaignService from '@/services/campaignService'
import toast from 'react-hot-toast'

export const useCampaigns = (params = {}) => {
  return useQuery({
    queryKey: ['campaigns', params],
    queryFn: () => campaignService.getCampaigns(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useCampaign = (id) => {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: () => campaignService.getCampaign(id),
    enabled: !!id,
  })
}

export const useCreateCampaign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: campaignService.createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      toast.success('Campaign created successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create campaign')
    },
  })
}

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => campaignService.updateCampaign(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.id] })
      toast.success('Campaign updated successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update campaign')
    },
  })
}

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: campaignService.deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      toast.success('Campaign deleted successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete campaign')
    },
  })
}
