import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import integrationService from '@/services/integrationService'
import toast from 'react-hot-toast'

export const useIntegrations = (params = {}) => {
  return useQuery({
    queryKey: ['integrations', params],
    queryFn: () => integrationService.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useIntegration = (type) => {
  return useQuery({
    queryKey: ['integration', type],
    queryFn: () => integrationService.getByType(type),
    enabled: !!type,
    staleTime: 1000 * 60 * 5,
  })
}

export const useUpdateIntegration = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ type, data }) => integrationService.update(type, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
      queryClient.invalidateQueries({ queryKey: ['integration', variables.type] })
      toast.success('Integration updated successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update integration')
    },
  })
}

export const useTestIntegration = () => {
  return useMutation({
    mutationFn: integrationService.testConnection,
    onSuccess: () => {
      toast.success('Connection test successful!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Connection test failed')
    },
  })
}
