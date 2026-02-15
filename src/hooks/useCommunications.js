import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import communicationService from '@/services/communicationService'
import toast from 'react-hot-toast'

// Get all communications with filters
export const useCommunications = (params = {}) => {
  return useQuery({
    queryKey: ['communications', params],
    queryFn: () => communicationService.getCommunications(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get single communication
export const useCommunication = (id) => {
  return useQuery({
    queryKey: ['communications', id],
    queryFn: () => communicationService.getCommunication(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  })
}

export const useSendEmail = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: communicationService.sendEmail,
    onSuccess: () => {
      toast.success('Email sent successfully!')
      queryClient.invalidateQueries({ queryKey: ['communications'] })
      queryClient.invalidateQueries({ queryKey: ['lead-timeline'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send email')
    },
  })
}

export const useSendSMS = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: communicationService.sendSMS,
    onSuccess: () => {
      toast.success('SMS sent successfully!')
      queryClient.invalidateQueries({ queryKey: ['communications'] })
      queryClient.invalidateQueries({ queryKey: ['lead-timeline'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send SMS')
    },
  })
}

export const useSendWhatsApp = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: communicationService.sendWhatsApp,
    onSuccess: () => {
      toast.success('WhatsApp message sent successfully!')
      queryClient.invalidateQueries({ queryKey: ['communications'] })
      queryClient.invalidateQueries({ queryKey: ['lead-timeline'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send WhatsApp message')
    },
  })
}
