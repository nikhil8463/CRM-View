import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Save,
  Zap,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  ExternalLink,
  MessageSquare,
  Bot,
  Globe,
  Mail,
  AlertCircle,
  Loader
} from 'lucide-react'

export default function IntegrationDetail() {
  const { service } = useParams()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)
  
  // Mock data - replace with actual API call
  const integrationConfigs = {
    twilio: {
      name: 'Twilio SMS',
      icon: MessageSquare,
      color: 'bg-danger-100 text-danger-600',
      status: 'active',
      description: 'Send and receive SMS messages through Twilio API',
      fields: [
        { key: 'account_sid', label: 'Account SID', type: 'text', required: true, value: 'AC1234567890abcdef1234567890abcd' },
        { key: 'auth_token', label: 'Auth Token', type: 'password', required: true, value: 'your_auth_token_here' },
        { key: 'phone_number', label: 'Twilio Phone Number', type: 'text', required: true, value: '+1234567890' },
        { key: 'messaging_service_sid', label: 'Messaging Service SID', type: 'text', required: false, value: 'MG1234567890abcdef1234567890abcd' },
        { key: 'status_callback_url', label: 'Status Callback URL', type: 'url', required: false, value: 'https://yourapp.com/webhook/twilio' },
      ],
      webhooks: [
        { name: 'Incoming SMS', url: 'https://yourapp.com/webhook/twilio/incoming' },
        { name: 'Status Updates', url: 'https://yourapp.com/webhook/twilio/status' },
      ],
      docs_url: 'https://www.twilio.com/docs/sms'
    },
    whatsapp: {
      name: 'WhatsApp Business',
      icon: MessageSquare,
      color: 'bg-success-100 text-success-600',
      status: 'active',
      description: 'Connect with WhatsApp Business API for messaging',
      fields: [
        { key: 'phone_number_id', label: 'Phone Number ID', type: 'text', required: true, value: '1234567890' },
        { key: 'access_token', label: 'Access Token', type: 'password', required: true, value: 'your_access_token_here' },
        { key: 'business_account_id', label: 'Business Account ID', type: 'text', required: true, value: '9876543210' },
        { key: 'webhook_verify_token', label: 'Webhook Verify Token', type: 'password', required: true, value: 'your_verify_token' },
      ],
      webhooks: [
        { name: 'Incoming Messages', url: 'https://yourapp.com/webhook/whatsapp/messages' },
        { name: 'Message Status', url: 'https://yourapp.com/webhook/whatsapp/status' },
      ],
      docs_url: 'https://developers.facebook.com/docs/whatsapp'
    },
    meta: {
      name: 'Meta (Facebook)',
      icon: Globe,
      color: 'bg-primary-100 text-primary-600',
      status: 'inactive',
      description: 'Integrate with Facebook Ads and Instagram',
      fields: [
        { key: 'app_id', label: 'App ID', type: 'text', required: true, value: '' },
        { key: 'app_secret', label: 'App Secret', type: 'password', required: true, value: '' },
        { key: 'access_token', label: 'Access Token', type: 'password', required: true, value: '' },
        { key: 'page_id', label: 'Facebook Page ID', type: 'text', required: false, value: '' },
        { key: 'instagram_account_id', label: 'Instagram Account ID', type: 'text', required: false, value: '' },
        { key: 'webhook_verify_token', label: 'Webhook Verify Token', type: 'password', required: false, value: '' },
      ],
      webhooks: [
        { name: 'Lead Ads', url: 'https://yourapp.com/webhook/meta/leadads' },
        { name: 'Page Messages', url: 'https://yourapp.com/webhook/meta/messages' },
      ],
      docs_url: 'https://developers.facebook.com/docs'
    },
    google: {
      name: 'Google Workspace',
      icon: Mail,
      color: 'bg-blue-100 text-blue-600',
      status: 'active',
      description: 'Connect Gmail, Calendar, and Google Drive',
      fields: [
        { key: 'client_id', label: 'Client ID', type: 'text', required: true, value: '1234567890-abcdefghijklmnop.apps.googleusercontent.com' },
        { key: 'client_secret', label: 'Client Secret', type: 'password', required: true, value: 'your_client_secret_here' },
        { key: 'refresh_token', label: 'Refresh Token', type: 'password', required: true, value: 'your_refresh_token_here' },
        { key: 'redirect_uri', label: 'Redirect URI', type: 'url', required: true, value: 'https://yourapp.com/oauth/google/callback' },
        { key: 'scopes', label: 'Scopes', type: 'text', required: true, value: 'gmail.send calendar.readonly drive.file' },
      ],
      webhooks: [],
      docs_url: 'https://developers.google.com/workspace'
    },
    retell: {
      name: 'Retell AI',
      icon: Bot,
      color: 'bg-purple-100 text-purple-600',
      status: 'active',
      description: 'AI-powered voice calls and conversation automation',
      fields: [
        { key: 'api_key', label: 'API Key', type: 'password', required: true, value: 'retell_api_key_here' },
        { key: 'agent_id', label: 'Default Agent ID', type: 'text', required: true, value: 'agent_1234567890' },
        { key: 'webhook_url', label: 'Webhook URL', type: 'url', required: false, value: 'https://yourapp.com/webhook/retell' },
        { key: 'voice_id', label: 'Voice ID', type: 'text', required: false, value: 'voice_en_us_female_1' },
        { key: 'language', label: 'Language', type: 'text', required: false, value: 'en-US' },
      ],
      webhooks: [
        { name: 'Call Started', url: 'https://yourapp.com/webhook/retell/call-started' },
        { name: 'Call Ended', url: 'https://yourapp.com/webhook/retell/call-ended' },
        { name: 'Transcription', url: 'https://yourapp.com/webhook/retell/transcription' },
      ],
      docs_url: 'https://docs.retellai.com'
    },
  }
  
  const config = integrationConfigs[service]
  const [formData, setFormData] = useState({})
  const [status, setStatus] = useState(config?.status || 'inactive')
  
  useEffect(() => {
    if (config) {
      const initialData = {}
      config.fields.forEach(field => {
        initialData[field.key] = field.value
      })
      setFormData(initialData)
    }
  }, [service])
  
  if (!config) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Integration Not Found</h3>
          <p className="text-slate-600 mb-6">The requested integration could not be found</p>
          <button onClick={() => navigate('/dashboard/integrations')} className="btn btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Integrations
          </button>
        </div>
      </div>
    )
  }
  
  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }
  
  const handleSave = () => {
    // TODO: Implement API call to save configuration
    console.log('Saving configuration:', formData)
    setIsEditing(false)
    // Show success message
  }
  
  const handleTestConnection = async () => {
    setTesting(true)
    setTestResult(null)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock test result - replace with actual API call
    const success = Math.random() > 0.3 // 70% success rate for demo
    setTestResult({
      success,
      message: success 
        ? 'Connection successful! Integration is working properly.' 
        : 'Connection failed. Please check your credentials and try again.'
    })
    setTesting(false)
  }
  
  const IconComponent = config.icon
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/integrations')}
            className="btn btn-secondary btn-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${config.color}`}>
              <IconComponent className="w-7 h-7" />
            </div>
            <div>
              <h1 className="page-title">{config.name}</h1>
              <p className="body-text text-slate-600">{config.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`badge ${
            status === 'active'
              ? 'bg-success-100 text-success-700'
              : 'bg-slate-100 text-slate-700'
          }`}>
            {status === 'active' ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1" />
                Active
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 mr-1" />
                Inactive
              </>
            )}
          </span>
          
          <button
            onClick={() => setStatus(status === 'active' ? 'inactive' : 'active')}
            className={`btn btn-sm ${
              status === 'active' ? 'btn-secondary' : 'btn-success'
            }`}
          >
            {status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
      
      {/* Configuration Form */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Configuration</h2>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-primary btn-sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary btn-sm"
              >
                Edit Configuration
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {config.fields.map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {field.label}
                {field.required && <span className="text-danger-500 ml-1">*</span>}
              </label>
              
              {field.type === 'password' ? (
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    disabled={!isEditing}
                    className="input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              ) : (
                <input
                  type={field.type}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  disabled={!isEditing}
                  className="input"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Test Connection */}
      <div className="card">
        <h2 className="section-title mb-4">Test Connection</h2>
        <p className="text-sm text-slate-600 mb-4">
          Test your integration configuration to ensure everything is working correctly.
        </p>
        
        <button
          onClick={handleTestConnection}
          disabled={testing || status === 'inactive'}
          className="btn btn-primary"
        >
          {testing ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Test Connection
            </>
          )}
        </button>
        
        {testResult && (
          <div className={`mt-4 p-4 rounded-xl ${
            testResult.success 
              ? 'bg-success-50 border border-success-200' 
              : 'bg-danger-50 border border-danger-200'
          }`}>
            <div className="flex items-start gap-3">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${
                  testResult.success ? 'text-success-900' : 'text-danger-900'
                }`}>
                  {testResult.success ? 'Connection Successful' : 'Connection Failed'}
                </p>
                <p className={`text-sm mt-1 ${
                  testResult.success ? 'text-success-700' : 'text-danger-700'
                }`}>
                  {testResult.message}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Webhooks */}
      {config.webhooks && config.webhooks.length > 0 && (
        <div className="card">
          <h2 className="section-title mb-4">Webhooks</h2>
          <p className="text-sm text-slate-600 mb-4">
            Configure these webhook URLs in your {config.name} account to receive real-time updates.
          </p>
          
          <div className="space-y-3">
            {config.webhooks.map((webhook, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-slate-900">{webhook.name}</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(webhook.url)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Copy URL
                  </button>
                </div>
                <code className="text-xs text-slate-600 break-all">{webhook.url}</code>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Documentation Link */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title mb-2">Documentation</h2>
            <p className="text-sm text-slate-600">
              Need help setting up {config.name}? Check out the official documentation.
            </p>
          </div>
          <a
            href={config.docs_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            View Docs
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </div>
  )
}
