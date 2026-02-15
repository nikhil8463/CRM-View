import { useQuery } from '@tanstack/react-query'
import auditService from '@/services/auditService'

export const useAuditLogs = (params = {}) => {
  return useQuery({
    queryKey: ['auditLogs', params],
    queryFn: () => auditService.getAll(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const useModelAuditLogs = (modelType, modelId) => {
  return useQuery({
    queryKey: ['auditLogs', 'model', modelType, modelId],
    queryFn: () => auditService.getByModel(modelType, modelId),
    enabled: !!modelType && !!modelId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const useUserAuditLogs = (userId) => {
  return useQuery({
    queryKey: ['auditLogs', 'user', userId],
    queryFn: () => auditService.getByUser(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}
