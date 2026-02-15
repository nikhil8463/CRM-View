import apiClient from './apiClient'

export const taskService = {
  // Get all tasks
  getTasks: async (params = {}) => {
    const response = await apiClient.get('/tasks', { params })
    return response.data
  },

  // Get single task
  getTask: async (id) => {
    const response = await apiClient.get(`/tasks/${id}`)
    return response.data
  },

  // Create task
  createTask: async (data) => {
    const response = await apiClient.post('/tasks', data)
    return response.data
  },

  // Update task
  updateTask: async (id, data) => {
    const response = await apiClient.put(`/tasks/${id}`, data)
    return response.data
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await apiClient.delete(`/tasks/${id}`)
    return response.data
  },

  // Mark task complete
  completeTask: async (id) => {
    const response = await apiClient.patch(`/tasks/${id}/complete`)
    return response.data
  },

  // Assign task
  assignTask: async (id, userId) => {
    const response = await apiClient.put(`/tasks/${id}`, { assigned_to: userId })
    return response.data
  },

  // Get overdue tasks
  getOverdueTasks: async (params = {}) => {
    const response = await apiClient.get('/tasks/overdue/list', { params })
    return response.data
  },
}

export default taskService
