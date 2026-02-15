import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Phone,
  MessageSquare,
  CheckSquare,
  Users as UsersIcon,
  Calendar,
  Sparkles,
  ChevronDown,
  Loader2
} from 'lucide-react'
import { useLeads, useUpdateLeadStatus, useAssignLead, useDeleteLead } from '@/hooks/useLeads'
import toast from 'react-hot-toast'

export default function Leads() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [campaignFilter, setCampaignFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [assignedFilter, setAssignedFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  
  // Fetch leads from backend with React Query
  const { data: leadsData, isLoading, error } = useLeads({
    search: searchQuery,
    campaign: campaignFilter !== 'all' ? campaignFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    assigned_to: assignedFilter !== 'all' ? assignedFilter : undefined,
    priority: priorityFilter !== 'all' ? priorityFilter : undefined,
  })
  const { mutate: updateStatus } = useUpdateLeadStatus()
  const { mutate: assignLead } = useAssignLead()
  const { mutate: deleteLead } = useDeleteLead()
  
  // Extract leads from response - Laravel returns {leads: [...], total: X}
  const leads = leadsData?.leads || leadsData?.data || []
  
  // Extract unique values for filters
  const campaigns = [...new Set(leads.map(l => l.campaign?.name).filter(Boolean))]
  const users = [...new Set(leads.map(l => l.assigned_user?.name).filter(Boolean))]
  
  // Status badge styles
  const statusStyles = {
    new: 'bg-primary-100 text-primary-700',
    contacted: 'bg-warning-100 text-warning-700',
    qualified: 'bg-success-100 text-success-700',
    converted: 'bg-slate-700 text-white',
    lost: 'bg-danger-100 text-danger-700',
  }
  
  // Priority badge styles
  const priorityStyles = {
    high: 'bg-danger-100 text-danger-700',
    medium: 'bg-warning-100 text-warning-700',
    low: 'bg-slate-100 text-slate-700',
  }
  
  // AI Score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success-600'
    if (score >= 60) return 'text-warning-600'
    return 'text-slate-600'
  }
  
  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-success-100'
    if (score >= 60) return 'bg-warning-100'
    return 'bg-slate-100'
  }
  
  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCampaign = campaignFilter === 'all' || lead.campaign === campaignFilter
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    const matchesAssigned = assignedFilter === 'all' || lead.assigned_to === assignedFilter
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter
    return matchesSearch && matchesCampaign && matchesStatus && matchesAssigned && matchesPriority
  })
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeads(filteredLeads.map(l => l.id))
    } else {
      setSelectedLeads([])
    }
  }
  
  const handleSelectLead = (leadId) => {
    if (selectedLeads.includes(leadId)) {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId))
    } else {
      setSelectedLeads([...selectedLeads, leadId])
    }
  }
  
  const handleBulkAction = (action) => {
    console.log('Bulk action:', action, 'for leads:', selectedLeads)
    // Implement bulk action logic here
    setShowBulkActions(false)
    setSelectedLeads([])
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="body-text text-slate-600 mt-2">Manage and track your leads</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => navigate('/dashboard/leads/create')}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Lead
          </button>
        </div>
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
                placeholder="Search by name or company..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200">
            {/* Campaign Filter */}
            <div>
              <label className="label-text mb-2">Campaign</label>
              <select
                value={campaignFilter}
                onChange={(e) => setCampaignFilter(e.target.value)}
                className="input w-full"
              >
                <option value="all">All Campaigns</option>
                {campaigns.map(campaign => (
                  <option key={campaign} value={campaign}>{campaign}</option>
                ))}
              </select>
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="label-text mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input w-full"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            
            {/* Assigned User Filter */}
            <div>
              <label className="label-text mb-2">Assigned To</label>
              <select
                value={assignedFilter}
                onChange={(e) => setAssignedFilter(e.target.value)}
                className="input w-full"
              >
                <option value="all">All Users</option>
                {users.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
            
            {/* Priority Filter */}
            <div>
              <label className="label-text mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="input w-full"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Bulk Actions Bar */}
      {selectedLeads.length > 0 && (
        <div className="card bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium text-slate-900">
                {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setSelectedLeads([])}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Clear selection
              </button>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="btn btn-primary"
              >
                Bulk Actions
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
              
              {showBulkActions && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-10">
                  <button
                    onClick={() => handleBulkAction('assign')}
                    className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <UsersIcon className="w-4 h-4 mr-3" />
                    Assign to User
                  </button>
                  <button
                    onClick={() => handleBulkAction('status')}
                    className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <CheckSquare className="w-4 h-4 mr-3" />
                    Update Status
                  </button>
                  <button
                    onClick={() => handleBulkAction('ai-call')}
                    className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <Phone className="w-4 h-4 mr-3" />
                    Trigger AI Call
                  </button>
                  <button
                    onClick={() => handleBulkAction('whatsapp')}
                    className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <MessageSquare className="w-4 h-4 mr-3" />
                    Send WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Leads Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 w-12">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300"
                  />
                </th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Campaign</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Priority</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Assigned To</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Source</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">AI Score</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* Loading State */}
              {isLoading && (
                <tr>
                  <td colSpan="9" className="p-8 text-center">
                    <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
                  </td>
                </tr>
              )}
              
              {/* Error State */}
              {error && (
                <tr>
                  <td colSpan="9" className="p-8">
                    <div className="text-center text-danger-700">
                      Failed to load leads. Please try again.
                    </div>
                  </td>
                </tr>
              )}
              
              {/* Data Rows */}
              {!isLoading && !error && filteredLeads.map((lead) => (
                <tr 
                  key={lead.id}
                  onClick={() => navigate(`/dashboard/leads/${lead.id}`)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                      className="rounded border-slate-300"
                    />
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-slate-900">{lead.name}</div>
                      <div className="text-sm text-slate-500">{lead.company}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-slate-700">{lead.campaign?.name || '-'}</span>
                  </td>
                  <td className="p-4">
                    <span className={`badge ${statusStyles[lead.status]} capitalize`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`badge ${priorityStyles[lead.priority]} capitalize`}>
                      {lead.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-slate-700">{lead.assigned_user?.name || 'Unassigned'}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-slate-600">{lead.source}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-lg ${getScoreBg(lead.ai_score)} flex items-center justify-center`}>
                        <span className={`text-sm font-bold ${getScoreColor(lead.ai_score)}`}>
                          {lead.ai_score}
                        </span>
                      </div>
                      <Sparkles className={`w-4 h-4 ${getScoreColor(lead.ai_score)}`} />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <UsersIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No leads found</h3>
            <p className="text-slate-600">
              {searchQuery || campaignFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first lead to get started'}
            </p>
          </div>
        )}
      </div>
      
      {/* Pagination - Placeholder */}
      {filteredLeads.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing {filteredLeads.length} of {leads.length} leads
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm" disabled>Previous</button>
            <button className="btn btn-outline btn-sm">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
