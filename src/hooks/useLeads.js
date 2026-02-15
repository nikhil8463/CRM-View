import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import leadService from '@/services/leadService'
import toast from 'react-hot-toast'

export const useLeads = (params = {}) => {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: () => leadService.getLeads(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  })
}

export const useLead = (id) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadService.getLead(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 3, // 3 minutes
  })
}

export const useLeadTimeline = (id) => {
  return useQuery({
    queryKey: ['lead-timeline', id],
    queryFn: () => leadService.getLeadTimeline(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const useCreateLead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: leadService.createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      toast.success('Lead created successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create lead')
    },
  })
}

export const useUpdateLead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => leadService.updateLead(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['lead', variables.id] })
      toast.success('Lead updated successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update lead')
    },
  })
}

export const useDeleteLead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: leadService.deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      toast.success('Lead deleted successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete lead')
    },
  })
}

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }) => leadService.updateLeadStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['lead', variables.id] })
      toast.success('Lead status updated!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status')
    },
  })
}

export const useAssignLead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, userId }) => leadService.assignLead(id, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['lead', variables.id] })
      toast.success('Lead assigned successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to assign lead')
    },
  })
}

export const useImportLeads = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: leadService.importLeads,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      const message = response?.message || `Successfully imported ${response?.imported || 0} leads`
      toast.success(message)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to import leads')
    },
  })
}
