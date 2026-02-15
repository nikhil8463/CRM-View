import { useState, useEffect } from 'react'
import { X, CheckSquare, Calendar, User, AlertCircle } from 'lucide-react'
import { useCreateTask } from '@/hooks/useTasks'
import { useLeads } from '@/hooks/useLeads'
import SearchableSelect from '@/components/common/SearchableSelect'
import apiClient from '@/services/apiClient'
import toast from 'react-hot-toast'

export default function AddTaskModal({ isOpen, onClose, campaignId, leadId = null }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'call',
    status: 'pending',
    priority: 'medium',
    due_date: '',
    lead_id: leadId || '',
    campaign_id: campaignId || '',
    assigned_to: '',
  })
  
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  const createTaskMutation = useCreateTask()
  
  // Fetch leads for the campaign
  const { data: leadsData } = useLeads({ campaign_id: campaignId })
  const campaignLeads = leadsData?.leads || []
  
  // Fetch users (staff) when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen])
  
  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const response = await apiClient.get('/users')
      const usersData = response.data.users || response.data.data || response.data || []
      // Ensure we have an array
      setUsers(Array.isArray(usersData) ? usersData : [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to load users')
      setUsers([]) // Set empty array on error
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Task title is required')
      return
    }

    try {
      await createTaskMutation.mutateAsync(formData)
      toast.success('Task created successfully!')
      onClose()
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'call',
        status: 'pending',
        priority: 'medium',
        due_date: '',
        lead_id: leadId || '',
        campaign_id: campaignId || '',
        assigned_to: '',
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Add New Task</h2>
                <p className="text-sm text-slate-600">Create a task for this campaign</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-5">
              {/* Task Title */}
              <div>
                <label className="label-text mb-2">
                  Task Title <span className="text-danger-600">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Follow up with lead"
                  className="input w-full"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="label-text mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add task details..."
                  rows={3}
                  className="input w-full resize-none"
                />
              </div>

              {/* Type and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <SearchableSelect
                  label="Type"
                  options={[
                    { value: 'call', label: 'Call' },
                    { value: 'email', label: 'Email' },
                    { value: 'meeting', label: 'Meeting' },
                    { value: 'follow_up', label: 'Follow Up' },
                    { value: 'demo', label: 'Demo' },
                    { value: 'other', label: 'Other' },
                  ]}
                  value={formData.type}
                  onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  showAvatar={false}
                  allowEmpty={false}
                />

                <SearchableSelect
                  label="Priority"
                  options={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                    { value: 'urgent', label: 'Urgent' },
                  ]}
                  value={formData.priority}
                  onChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                  showAvatar={false}
                  allowEmpty={false}
                />
              </div>

              {/* Status and Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <SearchableSelect
                  label="Status"
                  options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'in_progress', label: 'In Progress' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'cancelled', label: 'Cancelled' },
                  ]}
                  value={formData.status}
                  onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  showAvatar={false}
                  allowEmpty={false}
                />

                <div>
                  <label className="label-text mb-2">Due Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleChange}
                      className="input w-full pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Lead Selection (optional) */}
              {!leadId && (
                <SearchableSelect
                  label="Lead (Optional)"
                  options={campaignLeads}
                  value={formData.lead_id}
                  onChange={(value) => setFormData(prev => ({ ...prev, lead_id: value }))}
                  placeholder="Select a lead (optional)"
                  emptyText="No Lead (Campaign-level task)"
                  showAvatar={true}
                />
              )}

              {/* Assigned To */}
              <SearchableSelect
                label="Assign To"
                options={users}
                value={formData.assigned_to}
                onChange={(value) => setFormData(prev => ({ ...prev, assigned_to: value }))}
                placeholder="Select a user (optional)"
                emptyText="No assignment (assign to yourself)"
                showAvatar={true}
                disabled={loadingUsers}
              />

              {/* Info Box */}
              <div className="flex items-start gap-3 p-4 bg-primary-50 border border-primary-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-primary-800">
                  <p className="font-medium mb-1">Task Assignment</p>
                  <p>This task will be associated with the current campaign. You can also link it to a specific lead.</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createTaskMutation.isPending}
                className="btn btn-primary"
              >
                {createTaskMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Create Task
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
