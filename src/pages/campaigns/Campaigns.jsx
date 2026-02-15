import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Mail,
  Phone,
  Globe,
  FileText,
  Loader2
} from 'lucide-react'
import { useCampaigns, useDeleteCampaign } from '@/hooks/useCampaigns'
import toast from 'react-hot-toast'

export default function Campaigns() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [openDropdownId, setOpenDropdownId] = useState(null)
  
  // Fetch campaigns from backend with React Query
  const { data: campaignsData, isLoading, error } = useCampaigns({ 
    search: searchQuery,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    source_type: sourceFilter !== 'all' ? sourceFilter : undefined,
  })
  const { mutate: deleteCampaign, isPending: isDeleting } = useDeleteCampaign()
  
  // Extract campaigns from response - Laravel may return {campaigns: [...]} or {data: [...]}
  const campaigns = campaignsData?.campaigns || campaignsData?.data || []
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdownId !== null) {
        setOpenDropdownId(null)
      }
    }
    
    if (openDropdownId !== null) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [openDropdownId])
  
  // Handle campaign deletion with UI sync
  const handleDelete = (campaignId, campaignName) => {
    if (window.confirm(`Are you sure you want to delete "${campaignName}"?`)) {
      deleteCampaign(campaignId)
    }
  }
  
  // Status badge styles
  const statusStyles = {
    active: 'bg-success-100 text-success-700 border-success-200',
    scheduled: 'bg-primary-100 text-primary-700 border-primary-200',
    paused: 'bg-warning-100 text-warning-700 border-warning-200',
    completed: 'bg-slate-100 text-slate-700 border-slate-200',
  }
  
  // Source type icons
  const sourceIcons = {
    Email: Mail,
    Phone: Phone,
    Web: Globe,
    Manual: FileText,
  }
  
  // Client-side filtering is now minimal since backend handles main filtering
  const filteredCampaigns = campaigns
  
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Campaigns</h1>
          <p className="body-text text-slate-600 mt-2">Manage and track your marketing campaigns</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/campaigns/create')}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Campaign
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>
        
        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
            {/* Status Filter */}
            <div>
              <label className="label-text mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input w-full"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            {/* Source Type Filter */}
            <div>
              <label className="label-text mb-2">Source Type</label>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="input w-full"
              >
                <option value="all">All Sources</option>
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
                <option value="Web">Web</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Campaigns</p>
              <p className="text-2xl font-bold text-slate-900">{campaigns.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Leads</p>
              <p className="text-2xl font-bold text-slate-900">
                {campaigns.reduce((sum, c) => sum + (c.lead_count || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Budget</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(campaigns.reduce((sum, c) => sum + (parseFloat(c.budget) || 0), 0))}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ai-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-ai-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Now</p>
              <p className="text-2xl font-bold text-slate-900">
                {campaigns.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="card bg-danger-50 border-danger-200">
          <p className="text-danger-700">Failed to load campaigns. Please try again.</p>
        </div>
      )}
      
      {/* Campaign Cards Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCampaigns.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500">No campaigns found</p>
            </div>
          ) : (
            filteredCampaigns.map((campaign) => {
              // Backend uses 'channel' field, not 'source_type'
              const SourceIcon = sourceIcons[campaign.channel] || FileText // Default icon if not found
              const budgetPercent = campaign.budget ? ((campaign.spend || 0) / campaign.budget) * 100 : 0
              const conversionRate = campaign.lead_count ? (((campaign.converted_count || 0) / campaign.lead_count) * 100).toFixed(1) : '0.0'
          
          return (
            <div 
              key={campaign.id}
              onClick={() => navigate(`/dashboard/campaigns/${campaign.id}`)}
              className="card card-hover cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2">{campaign.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <SourceIcon className="w-4 h-4" />
                      <span>{campaign.channel || 'N/A'}</span>
                    </div>
                    <span 
                      className={`text-xs px-2 py-1 rounded-lg border capitalize ${statusStyles[campaign.status]}`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenDropdownId(openDropdownId === campaign.id ? null : campaign.id)
                    }}
                    className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-slate-400" />
                  </button>
                  {/* Dropdown Menu */}
                  {openDropdownId === campaign.id && (
                    <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenDropdownId(null)
                          navigate(`/dashboard/campaigns/${campaign.id}/edit`)
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Edit Campaign
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenDropdownId(null)
                          handleDelete(campaign.id, campaign.name)
                        }}
                        disabled={isDeleting}
                        className="w-full px-4 py-2 text-left text-sm text-danger-600 hover:bg-danger-50 transition-colors disabled:opacity-50"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete Campaign'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Date Range */}
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                <Calendar className="w-4 h-4" />
                <span>
                  {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'N/A'} - {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Leads</p>
                  <p className="text-lg font-bold text-slate-900">{campaign.lead_count || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Conversion</p>
                  <p className="text-lg font-bold text-success-600">{conversionRate}%</p>
                </div>
              </div>
              
              {/* Assigned Staff Avatars */}
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2">Assigned Staff</p>
                <div className="flex -space-x-2">
                  {(campaign.users || []).slice(0, 4).map((staff, idx) => (
                    <div
                      key={staff.id}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-ai-400 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                      title={staff.name}
                    >
                      {getInitials(staff.name)}
                    </div>
                  ))}
                  {(campaign.users || []).length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-600 text-xs font-medium">
                      +{(campaign.users || []).length - 4}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Budget Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                  <span>Budget: {formatCurrency(campaign.spend || 0)} / {formatCurrency(campaign.budget || 0)}</span>
                  <span className="font-medium">{budgetPercent.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
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
          )
        })
      )}
    </div>
  )}
    </div>
  )
}
