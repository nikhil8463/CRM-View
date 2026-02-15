import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import callService from '@/services/callService'
import toast from 'react-hot-toast'

export const useCalls = (params = {}) => {
  return useQuery({
    queryKey: ['calls', params],
    queryFn: () => callService.getCalls(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const useCall = (id) => {
  return useQuery({
    queryKey: ['call', id],
    queryFn: () => callService.getCall(id),
    enabled: !!id,
  })
}

export const useCallTranscript = (id) => {
  return useQuery({
    queryKey: ['call-transcript', id],
    queryFn: () => callService.getCallTranscript(id),
    enabled: !!id,
  })
}

export const useCreateCall = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: callService.createCall,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calls'] })
      toast.success('Call logged successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to log call')
    },
  })
}

export const useUpdateCall = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => callService.updateCall(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['calls'] })
      queryClient.invalidateQueries({ queryKey: ['call', variables.id] })
      toast.success('Call updated successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update call')
    },
  })
}

export const useDeleteCall = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: callService.deleteCall,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calls'] })
      toast.success('Call deleted successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete call')
    },
  })
}
