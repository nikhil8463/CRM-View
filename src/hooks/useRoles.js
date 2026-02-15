import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import roleService from '@/services/roleService'
import toast from 'react-hot-toast'

export const useRoles = (params = {}) => {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: () => roleService.getAll(params),
    staleTime: 1000 * 60 * 10, // 10 minutes (roles change infrequently)
  })
}

export const useRole = (id) => {
  return useQuery({
    queryKey: ['role', id],
    queryFn: () => roleService.getById(id),
    enabled: !!id,
  })
}

export const useCreateRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: roleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role created successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create role')
    },
  })
}

export const useUpdateRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => roleService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      queryClient.invalidateQueries({ queryKey: ['role', variables.id] })
      toast.success('Role updated successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update role')
    },
  })
}

export const useDeleteRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: roleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role deleted successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete role')
    },
  })
}
