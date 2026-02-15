import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Save,
  Check,
  X,
  Loader2,
  Phone,
  MessageSquare,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  AlertCircle,
} from 'lucide-react'
import { useCampaignIntegrations, useUpdateCampaignIntegration } from '@/hooks/useCampaignIntegrations'
import toast from 'react-hot-toast'

const integrationIcons = {
  retell: Phone,
  sms: MessageSquare,
  whatsapp: MessageSquare,
  meta: Facebook,
  email: Mail,
  instagram: Instagram,
  youtube: Youtube,
}

const integrationLabels = {
  retell: 'Retell AI Calling',
  sms: 'SMS',
  whatsapp: 'WhatsApp',
  meta: 'Meta (Facebook) Ads',
  email: 'Email',
  instagram: 'Instagram Ads',
  youtube: 'YouTube Ads',
}

export default function CampaignIntegrations() {
  const { id } = useParams()
  const { data, isLoading, error } = useCampaignIntegrations(id)
  const { mutate: updateIntegration, isPending } = useUpdateCampaignIntegration()
  
  const [editingType, setEditingType] = useState(null)
  const [formData, setFormData] = useState({})

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="card bg-danger-50 border-danger-200">
        <p className="text-danger-700">Failed to load integrations. Please try again.</p>
      </div>
    )
  }

  const integrations = data?.integrations || []

  const handleEdit = (integration) => {
    setEditingType(integration.integration_type)
    setFormData({
      is_enabled: integration.is_enabled,
      config: integration.config || {},
    })
  }

  const handleCancel = () => {
    setEditingType(null)
    setFormData({})
  }

  const handleSave = (integrationType) => {
    updateIntegration(
      {
        campaignId: id,
        integrationType,
        data: formData,
      },
      {
        onSuccess: () => {
          toast.success('Integration updated successfully!')
          setEditingType(null)
          setFormData({})
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Failed to update integration')
        },
      }
    )
  }

  const handleToggle = (integrationType, currentValue) => {
    const integration = integrations.find(i => i.integration_type === integrationType)
    updateIntegration(
      {
        campaignId: id,
        integrationType,
        data: {
          is_enabled: !currentValue,
          config: integration.config || {},
        },
      },
      {
        onSuccess: () => {
          toast.success(`Integration ${!currentValue ? 'enabled' : 'disabled'}`)
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Failed to update integration')
        },
      }
    )
  }

  const renderConfigFields = (type, config, isEditing) => {
    const isEdit = isEditing && editingType === type
    const currentConfig = isEdit ? formData.config : config

    const updateConfig = (field, value) => {
      setFormData(prev => ({
        ...prev,
        config: {
          ...prev.config,
          [field]: value,
        },
      }))
    }

    const renderField = (label, field, type = 'text', options = {}) => (
      <div key={field}>
        <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
        {type === 'checkbox' ? (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentConfig[field] || false}
              onChange={(e) => updateConfig(field, e.target.checked)}
              disabled={!isEdit}
              className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-slate-600">{options.checkboxLabel || 'Enable'}</span>
          </label>
        ) : (
          <input
            type={type}
            value={currentConfig[field] || ''}
            onChange={(e) => updateConfig(field, e.target.value)}
            disabled={!isEdit}
            className="input"
            placeholder={options.placeholder}
          />
        )}
      </div>
    )

    switch (type) {
      case 'retell':
        return (
          <div className="space-y-4">
            {renderField('API Key', 'api_key', 'password', { placeholder: 'Enter Retell AI API key' })}
            {renderField('Security Key', 'security_key', 'password', { placeholder: 'Enter security key' })}
            {renderField('Agent ID', 'agent_id', 'text', { placeholder: 'agent_12345' })}
            {renderField('Outbound Number', 'outbound_number', 'text', { placeholder: '+1234567890' })}
            {renderField('Voice ID', 'voice_id', 'text', { placeholder: 'voice_12345' })}
            {renderField('Auto Call on New Lead', 'auto_call_on_new_lead', 'checkbox', { checkboxLabel: 'Automatically call new leads' })}
          </div>
        )
      case 'sms':
        return (
          <div className="space-y-4">
            {renderField('API Key', 'api_key', 'password', { placeholder: 'Twilio API Key' })}
            {renderField('Security Key', 'security_key', 'password', { placeholder: 'Security/Auth Key' })}
            {renderField('Account SID', 'account_sid', 'text', { placeholder: 'Twilio Account SID' })}
            {renderField('Auth Token', 'auth_token', 'password', { placeholder: 'Twilio Auth Token' })}
            {renderField('Sender ID', 'sender_id', 'text', { placeholder: 'SMS Sender ID' })}
            {renderField('From Number', 'from_number', 'text', { placeholder: '+1234567890' })}
            {renderField('Auto SMS on Status Change', 'auto_sms_on_status_change', 'checkbox', { checkboxLabel: 'Send SMS when lead status changes' })}
          </div>
        )
      case 'whatsapp':
        return (
          <div className="space-y-4">
            {renderField('API Key', 'api_key', 'password', { placeholder: 'WhatsApp API Key' })}
            {renderField('Security Key', 'security_key', 'password', { placeholder: 'Security Key' })}
            {renderField('Business Account ID', 'business_account_id', 'text', { placeholder: 'Your business account ID' })}
            {renderField('Phone Number ID', 'phone_number_id', 'text', { placeholder: 'ph_12345' })}
            {renderField('Access Token', 'access_token', 'password', { placeholder: 'WhatsApp access token' })}
            {renderField('Auto WhatsApp on Assignment', 'auto_whatsapp_on_assignment', 'checkbox', { checkboxLabel: 'Send WhatsApp when lead is assigned' })}
          </div>
        )
      case 'meta':
        return (
          <div className="space-y-4">
            {renderField('API Key', 'api_key', 'password', { placeholder: 'Meta API Key' })}
            {renderField('Security Key', 'security_key', 'password', { placeholder: 'Security Key' })}
            {renderField('App ID', 'app_id', 'text', { placeholder: '123456789' })}
            {renderField('App Secret', 'app_secret', 'password', { placeholder: 'Meta App Secret' })}
            {renderField('Access Token', 'access_token', 'password', { placeholder: 'Meta access token' })}
            {renderField('Ad Account ID', 'ad_account_id', 'text', { placeholder: 'Ad account ID' })}
            {renderField('Auto Sync Leads', 'auto_sync_leads', 'checkbox', { checkboxLabel: 'Automatically sync leads from Meta' })}
          </div>
        )
      case 'email':
        return (
          <div className="space-y-4">
            {renderField('API Key', 'api_key', 'password', { placeholder: 'SMTP API Key (optional)' })}
            {renderField('Security Key', 'security_key', 'password', { placeholder: 'Security Key (optional)' })}
            {renderField('SMTP Host', 'smtp_host', 'text', { placeholder: 'smtp.example.com' })}
            {renderField('SMTP Port', 'smtp_port', 'number', { placeholder: '587' })}
            {renderField('SMTP Username', 'smtp_username', 'text', { placeholder: 'your@email.com' })}
            {renderField('SMTP Password', 'smtp_password', 'password', { placeholder: 'SMTP password' })}
            {renderField('SMTP Encryption', 'smtp_encryption', 'text', { placeholder: 'tls or ssl' })}
            {renderField('From Email', 'from_email', 'email', { placeholder: 'noreply@example.com' })}
            {renderField('From Name', 'from_name', 'text', { placeholder: 'Your Company' })}
            {renderField('Auto Follow-up Email', 'auto_followup_email', 'checkbox', { checkboxLabel: 'Send automatic follow-up emails' })}
          </div>
        )
      case 'instagram':
        return (
          <div className="space-y-4">
            {renderField('API Key', 'api_key', 'password', { placeholder: 'Instagram API Key' })}
            {renderField('Security Key', 'security_key', 'password', { placeholder: 'Security Key' })}
            {renderField('Business Account ID', 'business_account_id', 'text', { placeholder: 'Instagram business account ID' })}
            {renderField('Access Token', 'access_token', 'password', { placeholder: 'Instagram access token' })}
            {renderField('Auto Sync Leads', 'auto_sync_leads', 'checkbox', { checkboxLabel: 'Automatically sync leads from Instagram' })}
          </div>
        )
      case 'youtube':
        return (
          <div className="space-y-4">
            {renderField('API Key', 'api_key', 'password', { placeholder: 'YouTube Data API Key' })}
            {renderField('Security Key', 'security_key', 'password', { placeholder: 'Security Key' })}
            {renderField('Channel ID', 'channel_id', 'text', { placeholder: 'Your YouTube channel ID' })}
            {renderField('Google Ads Account ID', 'google_ads_account_id', 'text', { placeholder: '123-456-7890' })}
            {renderField('Refresh Token', 'refresh_token', 'password', { placeholder: '****' })}
            {renderField('Auto Sync Leads', 'auto_sync_leads', 'checkbox', { checkboxLabel: 'Automatically sync leads from YouTube' })}
          </div>
        )
      default:
        return <p className="text-sm text-slate-500">No configuration available</p>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Campaign Integrations</h2>
          <p className="text-sm text-slate-600 mt-1">Configure integrations specific to this campaign</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrations.map((integration) => {
          const Icon = integrationIcons[integration.integration_type] || Globe
          const isEditing = editingType === integration.integration_type

          return (
            <div key={integration.integration_type} className="card">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    integration.is_enabled ? 'bg-success-100' : 'bg-slate-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      integration.is_enabled ? 'text-success-600' : 'text-slate-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {integrationLabels[integration.integration_type]}
                    </h3>
                    {!integration.is_campaign_override && integration.has_global_config && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        Using global configuration
                      </p>
                    )}
                  </div>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => handleToggle(integration.integration_type, integration.is_enabled)}
                  disabled={isPending || isEditing}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    integration.is_enabled ? 'bg-success-600' : 'bg-slate-300'
                  } ${(isPending || isEditing) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      integration.is_enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                  integration.is_enabled
                    ? 'bg-success-50 text-success-700'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {integration.is_enabled ? (
                    <>
                      <Check className="w-3 h-3" />
                      Enabled
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3" />
                      Disabled
                    </>
                  )}
                </span>
              </div>

              {/* Configuration Fields */}
              {integration.is_enabled && (
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  {renderConfigFields(integration.integration_type, integration.config, true)}
                </div>
              )}

              {/* Actions */}
              {integration.is_enabled && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSave(integration.integration_type)}
                        disabled={isPending}
                        className="btn btn-primary text-sm flex-1"
                      >
                        {isPending ? (
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
                        disabled={isPending}
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
                      Configure
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
