import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import integrationService from '../services/integrationService'
import { toast } from 'react-hot-toast'

export const useGlobalIntegrations = () => {
  const queryClient = useQueryClient()

  // Fetch all global integrations
  const {
    data: integrationsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['global-integrations'],
    queryFn: () => integrationService.getAll(),
  })

  // Update integration configuration
  const updateIntegrationMutation = useMutation({
    mutationFn: ({ type, data }) => integrationService.update(type, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['global-integrations'] })
      toast.success('Integration configuration saved successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update integration')
    },
  })

  // Toggle integration status
  const toggleIntegrationMutation = useMutation({
    mutationFn: ({ type, isActive }) => integrationService.toggle(type, isActive),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['global-integrations'] })
      const status = data.integration.is_active ? 'enabled' : 'disabled'
      toast.success(`Integration ${status} successfully`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to toggle integration')
    },
  })

  return {
    integrations: integrationsData?.integrations || [],
    total: integrationsData?.total || 0,
    isLoading,
    error,
    refetch,
    updateIntegration: updateIntegrationMutation.mutate,
    toggleIntegration: toggleIntegrationMutation.mutate,
    isUpdating: updateIntegrationMutation.isPending || toggleIntegrationMutation.isPending,
  }
}

export default useGlobalIntegrations
