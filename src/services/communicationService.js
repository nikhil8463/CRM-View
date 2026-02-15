import apiClient from './apiClient'

export const communicationService = {
  // Get communications
  getCommunications: async (params = {}) => {
    const response = await apiClient.get('/communications', { params })
    return response.data
  },

  // Get single communication
  getCommunication: async (id) => {
    const response = await apiClient.get(`/communications/${id}`)
    return response.data
  },

  // Send email
  sendEmail: async (data) => {
    const response = await apiClient.post('/communications/email', data)
    return response.data
  },

  // Send SMS
  sendSMS: async (data) => {
    const response = await apiClient.post('/communications/sms', data)
    return response.data
  },

  // Send WhatsApp message
  sendWhatsApp: async (data) => {
    const response = await apiClient.post('/communications/whatsapp', data)
    return response.data
  },

  // Get email templates
  getEmailTemplates: async () => {
    const response = await apiClient.get('/communications/email-templates')
    return response.data
  },

  // Get SMS templates
  getSMSTemplates: async () => {
    const response = await apiClient.get('/communications/sms-templates')
    return response.data
  },

  // Get AI suggested response
  getAISuggestedResponse: async (context) => {
    const response = await apiClient.post('/communications/ai-suggest', context)
    return response.data
  },

  // Create communication log
  createLog: async (data) => {
    const response = await apiClient.post('/communication-logs', data)
    return response.data
  },
}

export default communicationService
