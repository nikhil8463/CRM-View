import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import communicationLogService from '@/services/communicationLogService'
import toast from 'react-hot-toast'

export const useCommunicationLogs = (params = {}) => {
  return useQuery({
    queryKey: ['communication-logs', params],
    queryFn: () => communicationLogService.getLogs(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

export const useCreateCommunicationLog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: communicationLogService.createLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communication-logs'] })
      toast.success('Communication log created successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create communication log')
    },
  })
}
