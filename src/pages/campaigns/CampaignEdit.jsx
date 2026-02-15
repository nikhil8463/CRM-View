import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  ArrowLeft,
  Save,
  Calendar,
  DollarSign,
  Target,
  FileText,
  Mail,
  Phone,
  Globe,
  Loader2,
  Users,
  ChevronDown,
  Check,
  Facebook
} from 'lucide-react'
import { useCampaign, useUpdateCampaign } from '@/hooks/useCampaigns'
import { useUsers } from '@/hooks/useUsers'
import campaignService from '@/services/campaignService'
import { getInitials } from '@/utils/helpers'
import toast from 'react-hot-toast'

export default function CampaignEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: campaignData, isLoading: loadingCampaign, error } = useCampaign(id)
  const { mutate: updateCampaign, isPending } = useUpdateCampaign()
  const { data: usersData } = useUsers()
  
  const [formData, setFormData] = useState({
    name: '',
    channel: 'Email',
    status: 'planned',
    description: '',
    start_date: '',
    end_date: '',
    budget: '',
    target_leads: '',
    assigned_user_id: '',
  })

  const [errors, setErrors] = useState({})
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  
  // Extract users from API response
  const users = usersData?.data || []
  
  // Get selected user object
  const selectedUser = users.find(u => u.id === parseInt(formData.assigned_user_id))

  // Load campaign data when available
  useEffect(() => {
    if (campaignData?.campaign) {
      const campaign = campaignData.campaign
      // Get the first assigned user if any
      const assignedUserId = campaign.users && campaign.users.length > 0 
        ? campaign.users[0].id 
        : ''
      
      // Map channel value - if not in our options, default to 'Manual'
      let channelValue = campaign.channel || 'Email'
      const validChannels = ['Email', 'Phone', 'Web', 'Meta', 'Manual']
      if (!validChannels.includes(channelValue)) {
        channelValue = 'Manual' // Default to Manual for non-standard channels
      }
      
      setFormData({
        name: campaign.name || '',
        channel: channelValue,
        status: campaign.status || 'planned',
        description: campaign.description || '',
        start_date: campaign.start_date || '',
        end_date: campaign.end_date || '',
        budget: campaign.budget || '',
        target_leads: campaign.target_leads || '',
        assigned_user_id: assignedUserId,
      })
    }
  }, [campaignData])

  const channelOptions = [
    { value: 'Email', label: 'Email', icon: Mail },
    { value: 'Phone', label: 'Phone', icon: Phone },
    { value: 'Web', label: 'Web', icon: Globe },
    { value: 'Meta', label: 'Meta/Facebook', icon: Facebook },
    { value: 'Manual', label: 'Manual', icon: FileText },
  ]

  const statusOptions = [
    { value: 'planned', label: 'Planned', color: 'slate' },
    { value: 'active', label: 'Active', color: 'success' },
    { value: 'paused', label: 'Paused', color: 'warning' },
    { value: 'completed', label: 'Completed', color: 'primary' },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required'
    }

    if (!formData.channel) {
      newErrors.channel = 'Channel is required'
    }

    if (formData.budget && isNaN(parseFloat(formData.budget))) {
      newErrors.budget = 'Budget must be a valid number'
    }

    if (formData.target_leads && isNaN(parseInt(formData.target_leads))) {
      newErrors.target_leads = 'Target leads must be a valid number'
    }

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        newErrors.end_date = 'End date must be after start date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    // Prepare data for API
    const campaignUpdateData = {
      name: formData.name.trim(),
      channel: formData.channel,
      status: formData.status,
      description: formData.description.trim() || null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      budget: formData.budget ? parseFloat(formData.budget) : null,
      target_leads: formData.target_leads ? parseInt(formData.target_leads) : null,
    }

    updateCampaign({ id, data: campaignUpdateData }, {
      onSuccess: async () => {
        // Update user assignment if changed
        if (formData.assigned_user_id) {
          try {
            await campaignService.assignUsers(id, [parseInt(formData.assigned_user_id)])
            toast.success('Campaign and assignment updated successfully!')
          } catch (error) {
            toast.warning('Campaign updated, but user assignment failed')
          }
        } else {
          // If no user selected, clear assignments
          try {
            await campaignService.assignUsers(id, [])
            toast.success('Campaign updated successfully!')
          } catch (error) {
            toast.success('Campaign updated successfully!')
          }
        }
        navigate(`/dashboard/campaigns/${id}`)
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update campaign')
      }
    })
  }

  // Loading state
  if (loadingCampaign) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    )
  }

  // Error state - only show if there's an actual error AND no data
  if (error && !campaignData?.campaign) {
    return (
      <div className="card bg-danger-50 border-danger-200">
        <p className="text-danger-700">
          Failed to load campaign details. {error?.message || 'Please try again.'}
        </p>
        <button 
          onClick={() => navigate('/dashboard/campaigns')}
          className="btn btn-secondary mt-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Campaigns
        </button>
      </div>
    )
  }

  // If still loading data, show loading
  if (!campaignData?.campaign) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/dashboard/campaigns/${id}`)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="page-title">Edit Campaign</h1>
            <p className="body-text text-slate-600 mt-1">Update campaign details</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="card space-y-6">
          {/* Basic Information Section */}
          <div>
            <h2 className="section-title mb-4">Basic Information</h2>
            
            {/* Campaign Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Campaign Name <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g., Q1 2026 Email Campaign"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-danger-600">{errors.name}</p>
              )}
            </div>

            {/* Channel */}
            <div className="mb-4">
              <label htmlFor="channel" className="block text-sm font-medium text-slate-700 mb-2">
                Channel <span className="text-danger-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {channelOptions.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange({ target: { name: 'channel', value: option.value } })}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        formData.channel === option.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <IconComponent className={`w-6 h-6 ${
                        formData.channel === option.value ? 'text-primary-600' : 'text-slate-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        formData.channel === option.value ? 'text-primary-900' : 'text-slate-700'
                      }`}>
                        {option.label}
                      </span>
                    </button>
                  )
                })}
              </div>
              {errors.channel && (
                <p className="mt-1 text-sm text-danger-600">{errors.channel}</p>
              )}
            </div>

            {/* Status */}
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Assign To */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                Assign To
              </label>
              
              {/* Custom Dropdown Button */}
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="input w-full flex items-center justify-between"
              >
                {selectedUser ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-ai-400 flex items-center justify-center text-white text-xs font-medium">
                      {getInitials(selectedUser.name)}
                    </div>
                    <span className="text-slate-900">{selectedUser.name}</span>
                  </div>
                ) : (
                  <span className="text-slate-500">Select a user (optional)</span>
                )}
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-lg max-h-64 overflow-y-auto">
                  {/* Clear Selection Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, assigned_user_id: '' }))
                      setShowUserDropdown(false)
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                      <Users className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="text-slate-500">No assignment</span>
                    {!formData.assigned_user_id && (
                      <Check className="w-5 h-5 text-primary-600 ml-auto" />
                    )}
                  </button>

                  {/* User Options */}
                  {users.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, assigned_user_id: user.id }))
                        setShowUserDropdown(false)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 transition-colors border-t border-slate-100"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-ai-400 flex items-center justify-center text-white text-xs font-medium">
                        {getInitials(user.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-slate-900 font-medium">{user.name}</div>
                        <div className="text-slate-500 text-sm truncate">{user.email}</div>
                      </div>
                      {formData.assigned_user_id === user.id && (
                        <Check className="w-5 h-5 text-primary-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input"
                placeholder="Describe the campaign objectives, target audience, and strategy..."
              />
            </div>
          </div>

          {/* Campaign Timeline Section */}
          <div className="border-t pt-6">
            <h2 className="section-title mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-400" />
              Campaign Timeline
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-slate-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className={`input ${errors.start_date ? 'input-error' : ''}`}
                />
                {errors.start_date && (
                  <p className="mt-1 text-sm text-danger-600">{errors.start_date}</p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-slate-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className={`input ${errors.end_date ? 'input-error' : ''}`}
                />
                {errors.end_date && (
                  <p className="mt-1 text-sm text-danger-600">{errors.end_date}</p>
                )}
              </div>
            </div>
          </div>

          {/* Budget & Targets Section */}
          <div className="border-t pt-6">
            <h2 className="section-title mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-slate-400" />
              Budget & Targets
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-2">
                  Budget (USD)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`input pl-10 ${errors.budget ? 'input-error' : ''}`}
                    placeholder="10000.00"
                  />
                </div>
                {errors.budget && (
                  <p className="mt-1 text-sm text-danger-600">{errors.budget}</p>
                )}
              </div>

              {/* Target Leads */}
              <div>
                <label htmlFor="target_leads" className="block text-sm font-medium text-slate-700 mb-2">
                  Target Leads
                </label>
                <input
                  type="number"
                  id="target_leads"
                  name="target_leads"
                  value={formData.target_leads}
                  onChange={handleChange}
                  min="0"
                  className={`input ${errors.target_leads ? 'input-error' : ''}`}
                  placeholder="1000"
                />
                {errors.target_leads && (
                  <p className="mt-1 text-sm text-danger-600">{errors.target_leads}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="border-t pt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/campaigns/${id}`)}
              className="btn btn-secondary"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Update Campaign
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
