import { useState } from 'react'
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
  Loader2
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useCampaign, useUpdateCampaign, useDeleteCampaign } from '@/hooks/useCampaigns'
import toast from 'react-hot-toast'

export default function CampaignDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  
  // Fetch campaign data from backend
  const { data: campaignData, isLoading, error } = useCampaign(id)
  const { mutate: updateCampaign } = useUpdateCampaign()
  const { mutate: deleteCampaign } = useDeleteCampaign()
  
  // Extract campaign from response - backend returns {campaign: {...}}
  const campaign = campaignData?.campaign
  
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
  if (isLoading) {
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
  
  // Lead source performance data
  const leadSourceData = [
    { source: 'LinkedIn', leads: 180, converted: 48 },
    { source: 'Website', leads: 120, converted: 35 },
    { source: 'Referral', leads: 90, converted: 25 },
    { source: 'Email List', leads: 60, converted: 12 },
  ]
  
  // AI call success data
  const aiCallData = [
    { outcome: 'Answered', count: 87, percentage: 60 },
    { outcome: 'Voicemail', count: 35, percentage: 24 },
    { outcome: 'No Answer', count: 18, percentage: 12 },
    { outcome: 'Failed', count: 5, percentage: 4 },
  ]
  
  // Status distribution
  const statusData = [
    { status: 'New', count: 120 },
    { status: 'Contacted', count: 180 },
    { status: 'Qualified', count: 90 },
    { status: 'Converted', count: 60 },
  ]
  
  // Conversion trend (monthly)
  const conversionTrend = [
    { month: 'Week 1', leads: 80, converted: 15 },
    { month: 'Week 2', leads: 110, converted: 25 },
    { month: 'Week 3', leads: 130, converted: 35 },
    { month: 'Week 4', leads: 130, converted: 45 },
  ]
  
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444']
  
  // Safe calculations with fallbacks
  const leadCount = campaign.target_leads || 0
  const convertedCount = 0 // Not available from API yet
  const aiEngaged = 0 // Not available from API yet
  const spentAmount = parseFloat(campaign.spend) || 0
  const budgetAmount = parseFloat(campaign.budget) || 0
  
  const conversionRate = leadCount > 0 ? ((convertedCount / leadCount) * 100).toFixed(1) : '0.0'
  const aiEngagementRate = leadCount > 0 ? ((aiEngaged / leadCount) * 100).toFixed(1) : '0.0'
  const budgetPercent = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'calls', label: 'Calls', icon: Phone },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'communications', label: 'Communication Logs', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
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
            <div className="flex items-center gap-3 mt-2">
              <span className={`badge ${campaign.status === 'active' ? 'badge-success' : 'badge-primary'}`}>
                {campaign.status}
              </span>
              <span className="text-sm text-slate-600">{campaign.channel}</span>
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
          <div className="relative group">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-slate-600" />
            </button>
            <div className="hidden group-hover:block absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left text-sm text-danger-600 hover:bg-danger-50 transition-colors"
              >
                Delete Campaign
              </button>
            </div>
          </div>
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
            
            {/* Lead Statistics */}
            <div className="card">
              <h3 className="section-title mb-4">Lead Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Total Leads</p>
                  <p className="text-2xl font-bold text-slate-900">{leadCount}</p>
                </div>
                <div className="p-4 bg-success-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Converted</p>
                  <p className="text-2xl font-bold text-success-600">{convertedCount}</p>
                </div>
                <div className="p-4 bg-ai-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">AI Engaged</p>
                  <p className="text-2xl font-bold text-ai-600">{aiEngaged}</p>
                </div>
                <div className="p-4 bg-primary-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-primary-600">{leadCount - aiEngaged}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="card">
            <h3 className="section-title mb-4">Campaign Leads</h3>
            <p className="text-slate-600">Lead list will be displayed here with filtering and sorting options.</p>
          </div>
        )}
        
        {/* Calls Tab */}
        {activeTab === 'calls' && (
          <div className="card">
            <h3 className="section-title mb-4">Call History</h3>
            <p className="text-slate-600">Call logs and AI call analytics will be displayed here.</p>
          </div>
        )}
        
        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="card">
            <h3 className="section-title mb-4">Campaign Tasks</h3>
            <p className="text-slate-600">Task list and management will be displayed here.</p>
          </div>
        )}
        
        {/* Communications Tab */}
        {activeTab === 'communications' && (
          <div className="card">
            <h3 className="section-title mb-4">Communication Logs</h3>
            <p className="text-slate-600">Email, SMS, and other communication logs will be displayed here.</p>
          </div>
        )}
        
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Lead Source Performance */}
            <div className="card">
              <h3 className="section-title mb-4">Lead Source Performance</h3>
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
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Call Success */}
              <div className="card">
                <h3 className="section-title mb-4">AI Call Success Rate</h3>
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
                      <div className="text-3xl font-bold text-slate-900">60%</div>
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
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={conversionTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
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
                      dataKey="converted" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Converted"
                      dot={{ fill: '#10b981', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
