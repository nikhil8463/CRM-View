import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Edit, 
  MoreVertical,
  Calendar,
  DollarSign,
  Users,
  Phone,
  Mail,
  MessageSquare,
  CheckSquare,
  TrendingUp,
  Target,
  Sparkles,
  BarChart3,
  PieChart,
  Loader2,
  Plug,
  Trash2
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useCampaign, useUpdateCampaign, useDeleteCampaign } from '@/hooks/useCampaigns'
import { useCampaignAnalytics } from '@/hooks/useCampaignAnalytics'
import { useLeads } from '@/hooks/useLeads'
import { useTasks } from '@/hooks/useTasks'
import { useCommunicationLogs } from '@/hooks/useCommunicationLogs'
import CampaignIntegrations from './CampaignIntegrations'
import AddLeadModal from '@/components/modals/AddLeadModal'
import AddTaskModal from '@/components/modals/AddTaskModal'
import LogCommunicationModal from '@/components/modals/LogCommunicationModal'
import toast from 'react-hot-toast'

export default function CampaignDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddLeadModal, setShowAddLeadModal] = useState(false)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [showLogCommModal, setShowLogCommModal] = useState(false)
  
  // Fetch campaign data from backend
  const { data: campaignData, isLoading, error } = useCampaign(id)
  const { data: analyticsData, isLoading: analyticsLoading } = useCampaignAnalytics(id)
  const { data: leadsData, isLoading: leadsLoading } = useLeads({ campaign_id: id })
  const { data: tasksData, isLoading: tasksLoading } = useTasks({ campaign_id: id })
  const { data: logsData, isLoading: logsLoading } = useCommunicationLogs({ campaign_id: id })
  const { mutate: updateCampaign } = useUpdateCampaign()
  const { mutate: deleteCampaign } = useDeleteCampaign()
  
  // Extract campaign and analytics from response
  const campaign = campaignData?.campaign
  const analytics = analyticsData?.analytics
  const campaignLeads = leadsData?.leads || []
  const campaignTasks = tasksData?.tasks || []
  const communicationLogs = logsData?.logs || []
  
  // Memoize all statistics calculations to prevent re-computing on every render
  const campaignStats = useMemo(() => ({
    // Lead stats
    newLeads: campaignLeads.filter(l => l.status === 'new').length,
    contactedLeads: campaignLeads.filter(l => l.status === 'contacted').length,
    wonLeads: campaignLeads.filter(l => l.status === 'won').length,
    // Task stats
    pendingTasks: campaignTasks.filter(t => t.status === 'pending').length,
    inProgressTasks: campaignTasks.filter(t => t.status === 'in_progress').length,
    completedTasks: campaignTasks.filter(t => t.status === 'completed').length,
    // Communication stats
    calls: communicationLogs.filter(l => l.type === 'call').length,
    emails: communicationLogs.filter(l => l.type === 'email').length,
    messages: communicationLogs.filter(l => ['sms', 'whatsapp'].includes(l.type)).length,
  }), [campaignLeads, campaignTasks, communicationLogs])
  
  // Handle campaign deletion
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${campaign?.name}"?`)) {
      deleteCampaign(id, {
        onSuccess: () => {
          navigate('/dashboard/campaigns')
        }
      })
    }
  }
  
  // Loading state
  if (isLoading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    )
  }
  
  // Error state - only show if there's an actual error AND no data
  if (error && !campaign) {
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
  if (!campaign) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    )
  }
  
  // Transform analytics data for charts
  // Lead source performance data - from analytics.source_distribution
  const leadSourceData = analytics?.source_distribution 
    ? Object.entries(analytics.source_distribution).map(([source, data]) => ({
        source: source.charAt(0).toUpperCase() + source.slice(1),
        leads: data.count,
        converted: data.converted || 0
      }))
    : []
  
  // AI call success data - from analytics.ai_call_outcomes
  const aiCallData = analytics?.ai_call_outcomes 
    ? Object.entries(analytics.ai_call_outcomes).map(([outcome, data]) => ({
        outcome: outcome.charAt(0).toUpperCase() + outcome.slice(1),
        count: data.count,
        percentage: data.percentage
      }))
    : []
  
  // Status distribution - from analytics.status_distribution
  const statusData = analytics?.status_distribution 
    ? Object.entries(analytics.status_distribution).map(([status, data]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count: data.count
      }))
    : []
  
  // Conversion trend - from analytics.conversion_trend
  const conversionTrend = analytics?.conversion_trend || []
  
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444']
  
  // Safe calculations with fallbacks from analytics
  const leadCount = analytics?.total_leads || 0
  const convertedCount = analytics?.converted_leads || 0
  const aiEngaged = aiCallData.reduce((sum, item) => sum + item.count, 0)
  const spentAmount = parseFloat(campaign.spend) || 0
  const budgetAmount = parseFloat(campaign.budget) || 0
  
  const conversionRate = analytics?.conversion_rate || 0
  const aiEngagementRate = leadCount > 0 ? ((aiEngaged / leadCount) * 100).toFixed(1) : '0.0'
  const budgetPercent = analytics?.budget_utilization || 0
  const costPerLead = analytics?.cost_per_lead || 0
  
  // Calculate successful calls percentage
  const successfulCallsPercentage = aiCallData.length > 0 
    ? aiCallData.find(item => item.outcome.toLowerCase().includes('answer'))?.percentage || 0
    : 0
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'communications', label: 'Communication Logs', icon: MessageSquare },
    { id: 'integrations', label: 'Integrations', icon: Plug },
  ]
  
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate('/dashboard/campaigns')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="page-title">{campaign.name}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className={`badge ${campaign.status === 'active' ? 'badge-success' : 'badge-primary'}`}>
                {campaign.status}
              </span>
              {/* Display channels */}
              {(() => {
                const channels = Array.isArray(campaign.channels) 
                  ? campaign.channels 
                  : (campaign.channel ? [campaign.channel] : [])
                return channels.map((ch, idx) => (
                  <span key={idx} className="text-sm px-2 py-1 bg-slate-100 text-slate-700 rounded-lg">
                    {ch}
                  </span>
                ))
              })()}
              <span className="text-sm text-slate-500">•</span>
              <span className="text-sm text-slate-600">
                {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(`/dashboard/campaigns/${id}/edit`)}
            className="btn btn-outline"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-outline text-danger-600 border-danger-300 hover:bg-danger-50 hover:border-danger-400"
            title="Delete Campaign"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Leads</p>
                    <p className="text-2xl font-bold text-slate-900">{leadCount}</p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-success-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Conversion Rate</p>
                    <p className="text-2xl font-bold text-success-600">{conversionRate}%</p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-ai-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-ai-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">AI Engagement</p>
                    <p className="text-2xl font-bold text-ai-600">{aiEngagementRate}%</p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning-100 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-warning-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Budget Used</p>
                    <p className="text-2xl font-bold text-slate-900">{budgetPercent.toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Statistics */}
            <div className="card">
              <h3 className="section-title mb-4">Lead Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Total Leads</p>
                  <p className="text-2xl font-bold text-slate-900">{leadCount}</p>
                  <p className="text-xs text-slate-500 mt-1">Target: {campaign.target_leads || 0}</p>
                </div>
                <div className="p-4 bg-success-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Converted</p>
                  <p className="text-2xl font-bold text-success-600">{convertedCount}</p>
                  <p className="text-xs text-success-600 mt-1">{conversionRate}% rate</p>
                </div>
                <div className="p-4 bg-ai-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Cost Per Lead</p>
                  <p className="text-2xl font-bold text-ai-600">{formatCurrency(costPerLead)}</p>
                  <p className="text-xs text-slate-500 mt-1">Total: {formatCurrency(spentAmount)}</p>
                </div>
                <div className="p-4 bg-primary-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Progress</p>
                  <p className="text-2xl font-bold text-primary-600">{analytics?.leads_progress || 0}%</p>
                  <p className="text-xs text-slate-500 mt-1">To target</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Campaign Metadata */}
              <div className="lg:col-span-2 card">
                <h3 className="section-title mb-4">Campaign Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Description</label>
                    <p className="text-slate-900 mt-1">{campaign.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase">Start Date</label>
                      <p className="text-slate-900 mt-1">{new Date(campaign.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase">End Date</label>
                      <p className="text-slate-900 mt-1">{new Date(campaign.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase">Budget</label>
                      <p className="text-slate-900 mt-1">{formatCurrency(budgetAmount)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase">Spent</label>
                      <p className="text-slate-900 mt-1">{formatCurrency(spentAmount)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase mb-2 block">Budget Progress</label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{formatCurrency(spentAmount)} spent</span>
                        <span className="font-medium text-slate-900">{budgetPercent.toFixed(0)}%</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            budgetPercent > 90 ? 'bg-danger-500' : 
                            budgetPercent > 70 ? 'bg-warning-500' : 
                            'bg-success-500'
                          }`}
                          style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase">Created</label>
                      <p className="text-slate-900 mt-1">{new Date(campaign.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase">Last Updated</label>
                      <p className="text-slate-900 mt-1">{new Date(campaign.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Assigned Staff */}
              <div className="card">
                <h3 className="section-title mb-4">Assigned Staff</h3>
                <div className="space-y-3">
                  {(campaign.users || []).map((staff) => (
                    <div key={staff.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-ai-400 flex items-center justify-center text-white font-medium">
                        {getInitials(staff.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{staff.name}</p>
                        <p className="text-xs text-slate-500 truncate">{staff.email}</p>
                      </div>
                    </div>
                  ))}
                  
                  <button className="w-full btn btn-outline text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Staff
                  </button>
                </div>
              </div>
            </div>

            {/* Analytics Section */}
            <div className="space-y-6 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-slate-900">Analytics & Insights</h2>
              </div>

              {/* Lead Source Performance */}
              <div className="card">
                <h3 className="section-title mb-4">Lead Source Performance</h3>
                {leadSourceData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={leadSourceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="source" tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '16px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="leads" fill="#6366f1" name="Total Leads" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="converted" fill="#10b981" name="Converted" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-slate-500">
                    <p>No lead source data available yet</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* AI Call Success */}
                <div className="card">
                  <h3 className="section-title mb-4">AI Call Success Rate</h3>
                  {aiCallData.length > 0 ? (
                    <>
                      <div className="flex items-center justify-center mb-6">
                        <div className="relative w-48 h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                              <Pie
                                data={aiCallData}
                                dataKey="count"
                                nameKey="outcome"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                              >
                                {aiCallData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </RePieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-3xl font-bold text-slate-900">{successfulCallsPercentage.toFixed(0)}%</div>
                            <div className="text-xs text-slate-500">Success Rate</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {aiCallData.map((item, index) => (
                          <div key={item.outcome} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[index] }} />
                              <span className="text-sm text-slate-900">{item.outcome}</span>
                            </div>
                            <div className="text-sm font-medium text-slate-900">{item.count} ({item.percentage}%)</div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-slate-500">
                      <p>No AI call data available yet</p>
                    </div>
                  )}
                </div>
                
                {/* Status Distribution */}
                <div className="card">
                  <h3 className="section-title mb-4">Lead Status Distribution</h3>
                  <div className="space-y-4">
                    {statusData.map((item, index) => {
                      const total = statusData.reduce((sum, s) => sum + s.count, 0)
                      const percentage = ((item.count / total) * 100).toFixed(0)
                      return (
                        <div key={item.status}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-900">{item.status}</span>
                            <span className="text-sm text-slate-600">{item.count} ({percentage}%)</span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Total Leads</p>
                        <p className="text-xl font-bold text-slate-900">
                          {statusData.reduce((sum, s) => sum + s.count, 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Conversion Rate</p>
                        <p className="text-xl font-bold text-success-600">{conversionRate}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Conversion Trend */}
              <div className="card">
                <h3 className="section-title mb-4">Conversion Trend</h3>
                {conversionTrend.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={conversionTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '16px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="leads" 
                          stroke="#6366f1" 
                          strokeWidth={2}
                          name="Total Leads"
                          dot={{ fill: '#6366f1', r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="conversions" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Converted"
                          dot={{ fill: '#10b981', r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-slate-500">
                    <p>No conversion trend data available yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            {/* Header with stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Leads</p>
                    <p className="text-2xl font-bold text-slate-900">{campaignLeads.length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">New</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {campaignStats.newLeads}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-slate-600" />
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Contacted</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {campaignStats.contactedLeads}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Converted</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {campaignStats.wonLeads}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-success-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-success-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Leads Table */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title">Campaign Leads</h3>
                <button 
                  onClick={() => setShowAddLeadModal(true)}
                  className="btn btn-primary btn-sm"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Add Lead
                </button>
              </div>
              
              {leadsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                </div>
              ) : campaignLeads.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No leads in this campaign yet</p>
                  <button 
                    onClick={() => setShowAddLeadModal(true)}
                    className="btn btn-primary mt-4"
                  >
                    Add Your First Lead
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Phone</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Source</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Assigned To</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaignLeads.map((lead) => (
                        <tr 
                          key={lead.id} 
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                          onClick={() => navigate(`/dashboard/leads/${lead.id}`)}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-ai-400 flex items-center justify-center text-white text-sm font-medium">
                                {getInitials(lead.name || `${lead.first_name} ${lead.last_name}`)}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">
                                  {lead.name || `${lead.first_name} ${lead.last_name}`}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">{lead.email}</td>
                          <td className="py-3 px-4 text-sm text-slate-600">{lead.phone || '-'}</td>
                          <td className="py-3 px-4">
                            <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-lg">
                              {lead.source || 'Unknown'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`badge ${
                              lead.status === 'won' ? 'badge-success' :
                              lead.status === 'lost' ? 'badge-danger' :
                              lead.status === 'contacted' ? 'badge-primary' :
                              lead.status === 'qualified' ? 'badge-info' :
                              'badge-secondary'
                            }`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {lead.assigned_user?.name || 'Unassigned'}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Task Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Tasks</p>
                    <p className="text-2xl font-bold text-slate-900">{campaignTasks.length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <CheckSquare className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Pending</p>
                    <p className="text-2xl font-bold text-warning-600">
                      {campaignStats.pendingTasks}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-warning-100 flex items-center justify-center">
                    <CheckSquare className="w-5 h-5 text-warning-600" />
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">In Progress</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {campaignStats.inProgressTasks}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <CheckSquare className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Completed</p>
                    <p className="text-2xl font-bold text-success-600">
                      {campaignStats.completedTasks}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-success-100 flex items-center justify-center">
                    <CheckSquare className="w-5 h-5 text-success-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title">Tasks</h3>
                <button 
                  onClick={() => setShowAddTaskModal(true)}
                  className="btn btn-primary btn-sm"
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Add Task
                </button>
              </div>

              {tasksLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                </div>
              ) : campaignTasks.length === 0 ? (
                <div className="text-center py-12">
                  <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No tasks for this campaign yet</p>
                  <button 
                    onClick={() => setShowAddTaskModal(true)}
                    className="btn btn-primary mt-4"
                  >
                    Create Your First Task
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {campaignTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/dashboard/tasks/${task.id}`)}
                    >
                      {/* Checkbox */}
                      <div className="mt-1">
                        <input
                          type="checkbox"
                          checked={task.status === 'completed'}
                          onChange={(e) => e.stopPropagation()}
                          className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                      </div>

                      {/* Task Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className={`font-medium ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              {/* Status */}
                              <span className={`badge ${
                                task.status === 'completed' ? 'badge-success' :
                                task.status === 'in_progress' ? 'badge-primary' :
                                task.status === 'pending' ? 'badge-warning' :
                                'badge-secondary'
                              }`}>
                                {task.status}
                              </span>

                              {/* Priority */}
                              {task.priority && (
                                <span className={`badge ${
                                  task.priority === 'high' ? 'badge-danger' :
                                  task.priority === 'medium' ? 'badge-warning' :
                                  'badge-secondary'
                                }`}>
                                  {task.priority} priority
                                </span>
                              )}

                              {/* Type */}
                              {task.type && (
                                <span className="text-xs text-slate-500">
                                  {task.type}
                                </span>
                              )}

                              {/* Due Date */}
                              {task.due_date && (
                                <span className={`text-xs flex items-center gap-1 ${
                                  new Date(task.due_date) < new Date() && task.status !== 'completed'
                                    ? 'text-danger-600 font-medium'
                                    : 'text-slate-500'
                                }`}>
                                  <Calendar className="w-3 h-3" />
                                  {new Date(task.due_date).toLocaleDateString()}
                                </span>
                              )}

                              {/* Assigned User */}
                              {task.assigned_user && (
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {task.assigned_user.name}
                                </span>
                              )}

                              {/* Lead */}
                              {task.lead && (
                                <span className="text-xs text-slate-500">
                                  Lead: {task.lead.name || `${task.lead.first_name} ${task.lead.last_name}`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Communications Tab */}
        {activeTab === 'communications' && (
          <div className="space-y-6">
            {/* Communication Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Communications</p>
                    <p className="text-2xl font-bold text-slate-900">{communicationLogs.length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Calls</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {campaignStats.calls}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Emails</p>
                    <p className="text-2xl font-bold text-success-600">
                      {campaignStats.emails}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-success-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-success-600" />
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">SMS & Messages</p>
                    <p className="text-2xl font-bold text-ai-600">
                      {campaignStats.messages}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-ai-100 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-ai-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Communication Logs List */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title">Communication History</h3>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowLogCommModal(true)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Log Communication
                </button>
              </div>

              {logsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                </div>
              ) : communicationLogs.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No communication logs for this campaign yet</p>
                  <button 
                    className="btn btn-primary mt-4"
                    onClick={() => setShowLogCommModal(true)}
                  >
                    Log Your First Communication
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {communicationLogs.map((log) => {
                    // Determine icon and color based on type
                    const getTypeIcon = (type) => {
                      switch(type) {
                        case 'call': return <Phone className="w-5 h-5" />
                        case 'email': return <Mail className="w-5 h-5" />
                        case 'sms': 
                        case 'whatsapp': return <MessageSquare className="w-5 h-5" />
                        default: return <MessageSquare className="w-5 h-5" />
                      }
                    }

                    const getTypeColor = (type) => {
                      switch(type) {
                        case 'call': return 'bg-primary-100 text-primary-600'
                        case 'email': return 'bg-success-100 text-success-600'
                        case 'sms': return 'bg-warning-100 text-warning-600'
                        case 'whatsapp': return 'bg-ai-100 text-ai-600'
                        default: return 'bg-slate-100 text-slate-600'
                      }
                    }

                    return (
                      <div
                        key={log.id}
                        className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getTypeColor(log.type)}`}>
                          {getTypeIcon(log.type)}
                        </div>

                        {/* Log Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`badge ${
                                  log.type === 'call' ? 'badge-primary' :
                                  log.type === 'email' ? 'badge-success' :
                                  log.type === 'sms' ? 'badge-warning' :
                                  log.type === 'whatsapp' ? 'badge-info' :
                                  'badge-secondary'
                                }`}>
                                  {log.type}
                                </span>
                                
                                {log.direction && (
                                  <span className="text-xs px-2 py-1 bg-slate-200 text-slate-700 rounded">
                                    {log.direction}
                                  </span>
                                )}

                                {log.status && (
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    log.status === 'completed' || log.status === 'sent' ? 'bg-success-100 text-success-700' :
                                    log.status === 'failed' ? 'bg-danger-100 text-danger-700' :
                                    'bg-warning-100 text-warning-700'
                                  }`}>
                                    {log.status}
                                  </span>
                                )}
                              </div>

                              {log.subject && (
                                <h4 className="font-medium text-slate-900 mt-2">
                                  {log.subject}
                                </h4>
                              )}

                              {log.notes && (
                                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                  {log.notes}
                                </p>
                              )}

                              <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
                                {log.lead && (
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    Lead: {log.lead.name || `${log.lead.first_name} ${log.lead.last_name}`}
                                  </span>
                                )}

                                {log.created_by_user && (
                                  <span>
                                    By: {log.created_by_user.name}
                                  </span>
                                )}

                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(log.created_at).toLocaleString()}
                                </span>

                                {log.duration && (
                                  <span>
                                    Duration: {log.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <CampaignIntegrations />
        )}
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal 
        isOpen={showAddLeadModal}
        onClose={() => setShowAddLeadModal(false)}
        campaignId={id}
      />

      {/* Add Task Modal */}
      <AddTaskModal 
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        campaignId={id}
      />

      {/* Log Communication Modal */}
      <LogCommunicationModal
        isOpen={showLogCommModal}
        onClose={() => setShowLogCommModal(false)}
        campaignId={id}
      />
    </div>
  )
}
