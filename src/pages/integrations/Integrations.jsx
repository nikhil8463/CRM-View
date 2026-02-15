import { useState } from 'react'
import { 
  Search, 
  Plug,
  CheckCircle,
  XCircle,
  Settings,
  Phone,
  MessageSquare,
  Mail,
  Instagram,
  Youtube,
  Globe,
  Loader2,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useGlobalIntegrations } from '@/hooks/useGlobalIntegrations'

export default function Integrations() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingType, setEditingType] = useState(null)
  const [formData, setFormData] = useState({})
  const [showSecrets, setShowSecrets] = useState({})
  
  const { 
    integrations, 
    total, 
    isLoading, 
    error, 
    updateIntegration, 
    toggleIntegration,
    isUpdating 
  } = useGlobalIntegrations()
  
  // Integration icons mapping
  const integrationIcons = {
    retell: Phone,
    sms: MessageSquare,
    whatsapp: MessageSquare,
    meta: Globe,
    email: Mail,
    instagram: Instagram,
    youtube: Youtube,
  }

  // Integration labels
  const integrationLabels = {
    retell: 'Retell AI',
    sms: 'SMS / Twilio',
    whatsapp: 'WhatsApp Business',
    meta: 'Meta Ads',
    email: 'Email / SMTP',
    instagram: 'Instagram Business',
    youtube: 'YouTube',
  }

  // Integration descriptions
  const integrationDescriptions = {
    retell: 'AI-powered voice calls and conversational agents',
    sms: 'Send SMS messages via Twilio integration',
    whatsapp: 'WhatsApp Business API for messaging',
    meta: 'Meta advertising and lead generation',
    email: 'Email delivery via SMTP configuration',
    instagram: 'Instagram business account integration',
    youtube: 'YouTube channel and video management',
  }
  
  // Apply filters
  const filteredIntegrations = integrations.filter(integration => {
    const type = integration.integration_type || integration.type
    const label = integrationLabels[type] || type
    const description = integrationDescriptions[type] || ''
    
    const matchesSearch = label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'active' && integration.is_active) ||
                          (statusFilter === 'inactive' && !integration.is_active)
    return matchesSearch && matchesStatus
  })
  
  // Calculate stats
  const activeIntegrations = integrations.filter(i => i.is_active).length
  const inactiveIntegrations = integrations.filter(i => !i.is_active).length

  const handleEdit = (integration) => {
    const type = integration.integration_type || integration.type
    setEditingType(type)
    setFormData(integration.config || {})
    setShowSecrets({})
  }

  const handleCancel = () => {
    setEditingType(null)
    setFormData({})
    setShowSecrets({})
  }

  const handleSave = (type) => {
    updateIntegration({
      type,
      data: {
        config: formData,
        is_active: true,
      },
    })
    setEditingType(null)
    setFormData({})
    setShowSecrets({})
  }

  const handleToggle = (integration) => {
    const type = integration.integration_type || integration.type
    toggleIntegration({
      type,
      isActive: !integration.is_active,
    })
  }

  const toggleSecretVisibility = (field) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  // Render configuration fields based on integration type
  const renderConfigFields = (type, config, isEditing) => {
    const updateField = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }))
    }

    const renderInput = (field, label, type = 'text', placeholder = '') => {
      const isSecret = field.includes('key') || field.includes('token') || field.includes('password') || field.includes('secret')
      const value = isEditing ? (formData[field] || '') : (config[field] || '')
      const isMasked = !isEditing && value && value.includes('****')
      const showValue = showSecrets[field]

      return (
        <div key={field}>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
          <div className="relative">
            <input
              type={isSecret && !showValue ? 'password' : type}
              value={value}
              onChange={(e) => updateField(field, e.target.value)}
              placeholder={placeholder}
              disabled={!isEditing || isMasked}
              className="input pr-10"
            />
            {isSecret && value && (
              <button
                type="button"
                onClick={() => toggleSecretVisibility(field)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      )
    }

    switch (type) {
      case 'retell':
        return (
          <>
            {renderInput('api_key', 'API Key', 'text', 'Enter Retell AI API key')}
            {renderInput('security_key', 'Security Key', 'text', 'Enter security key')}
            {renderInput('agent_id', 'Agent ID', 'text', 'Enter agent ID')}
            {renderInput('phone_number', 'Phone Number', 'text', '+1234567890')}
          </>
        )
      
      case 'sms':
        return (
          <>
            {renderInput('api_key', 'API Key', 'text', 'Twilio API Key')}
            {renderInput('security_key', 'Security Key', 'text', 'Security/Auth Key')}
            {renderInput('account_sid', 'Account SID', 'text', 'Twilio Account SID')}
            {renderInput('auth_token', 'Auth Token', 'password', 'Twilio Auth Token')}
            {renderInput('sender_id', 'Sender ID', 'text', 'SMS Sender ID')}
            {renderInput('phone_number', 'Phone Number', 'text', '+1234567890')}
          </>
        )
      
      case 'whatsapp':
        return (
          <>
            {renderInput('api_key', 'API Key', 'text', 'WhatsApp API Key')}
            {renderInput('security_key', 'Security Key', 'text', 'Security Key')}
            {renderInput('business_account_id', 'Business Account ID', 'text', 'Your business account ID')}
            {renderInput('phone_number_id', 'Phone Number ID', 'text', 'Phone number ID')}
            {renderInput('access_token', 'Access Token', 'password', 'WhatsApp access token')}
          </>
        )
      
      case 'meta':
        return (
          <>
            {renderInput('api_key', 'API Key', 'text', 'Meta API Key')}
            {renderInput('security_key', 'Security Key', 'text', 'Security Key')}
            {renderInput('app_id', 'App ID', 'text', 'Meta App ID')}
            {renderInput('app_secret', 'App Secret', 'password', 'Meta App Secret')}
            {renderInput('access_token', 'Access Token', 'password', 'Meta access token')}
            {renderInput('ad_account_id', 'Ad Account ID', 'text', 'Ad account ID')}
          </>
        )
      
      case 'email':
        return (
          <>
            {renderInput('api_key', 'API Key', 'text', 'SMTP API Key (optional)')}
            {renderInput('security_key', 'Security Key', 'text', 'Security Key (optional)')}
            {renderInput('smtp_host', 'SMTP Host', 'text', 'smtp.example.com')}
            {renderInput('smtp_port', 'SMTP Port', 'number', '587')}
            {renderInput('smtp_username', 'SMTP Username', 'text', 'your@email.com')}
            {renderInput('smtp_password', 'SMTP Password', 'password', 'SMTP password')}
            {renderInput('smtp_encryption', 'Encryption', 'text', 'tls or ssl')}
            {renderInput('from_email', 'From Email', 'email', 'noreply@example.com')}
            {renderInput('from_name', 'From Name', 'text', 'Your Company')}
          </>
        )
      
      case 'instagram':
        return (
          <>
            {renderInput('api_key', 'API Key', 'text', 'Instagram API Key')}
            {renderInput('security_key', 'Security Key', 'text', 'Security Key')}
            {renderInput('business_account_id', 'Business Account ID', 'text', 'Instagram business account ID')}
            {renderInput('access_token', 'Access Token', 'password', 'Instagram access token')}
          </>
        )
      
      case 'youtube':
        return (
          <>
            {renderInput('api_key', 'API Key', 'text', 'YouTube Data API Key')}
            {renderInput('security_key', 'Security Key', 'text', 'Security Key')}
            {renderInput('channel_id', 'Channel ID', 'text', 'Your YouTube channel ID')}
          </>
        )
      
      default:
        return <p className="text-sm text-slate-500">No configuration available</p>
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Integrations</h1>
          <p className="body-text text-slate-600 mt-2">Manage external integrations and API connections</p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Integrations</p>
              <p className="text-2xl font-bold text-slate-900">{total}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <Plug className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Active</p>
              <p className="text-2xl font-bold text-slate-900">{activeIntegrations}</p>
              <p className="text-xs text-success-600 mt-1">Connected & synced</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Inactive</p>
              <p className="text-2xl font-bold text-slate-900">{inactiveIntegrations}</p>
              <p className="text-xs text-slate-500 mt-1">Not configured</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input lg:w-48"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="col-span-full card bg-danger-50 border-danger-200">
            <p className="text-danger-700">Failed to load integrations. Please try again.</p>
          </div>
        ) : filteredIntegrations.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <Plug className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No integrations found</p>
          </div>
        ) : (
          filteredIntegrations.map((integration) => {
            const type = integration.integration_type || integration.type
            const Icon = integrationIcons[type] || Plug
            const isActive = integration.is_active || integration.status === 'active'
            const isEditing = editingType === type

            return (
              <div key={type} className="card">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-success-100' : 'bg-slate-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        isActive ? 'text-success-600' : 'text-slate-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {integrationLabels[type] || type}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Global Configuration
                      </p>
                    </div>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(integration)}
                    disabled={isUpdating || isEditing}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isActive ? 'bg-success-600' : 'bg-slate-300'
                    } ${(isUpdating || isEditing) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-4">
                  {integrationDescriptions[type] || 'No description available'}
                </p>

                {/* Status Badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                    isActive
                      ? 'bg-success-50 text-success-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isActive ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Inactive
                      </>
                    )}
                  </span>
                </div>

                {/* Configuration Fields */}
                {isActive && (
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    {renderConfigFields(type, integration.config || {}, isEditing)}
                  </div>
                )}

                {/* Actions */}
                {isActive && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSave(type)}
                          disabled={isUpdating}
                          className="btn btn-primary text-sm flex-1"
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={isUpdating}
                          className="btn btn-secondary text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(integration)}
                        className="btn btn-outline text-sm w-full"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
