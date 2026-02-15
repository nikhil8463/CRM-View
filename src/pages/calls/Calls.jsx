import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Phone,
  Clock,
  Calendar,
  Sparkles,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Loader2
} from 'lucide-react'
import { useCalls, useDeleteCall } from '@/hooks/useCalls'
import toast from 'react-hot-toast'

export default function Calls() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [campaignFilter, setCampaignFilter] = useState('all')
  const [outcomeFilter, setOutcomeFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  
  // Fetch calls from backend with React Query
  const { data: callsData, isLoading, error } = useCalls({
    search: searchQuery,
    campaign: campaignFilter !== 'all' ? campaignFilter : undefined,
    outcome: outcomeFilter !== 'all' ? outcomeFilter : undefined,
    date_filter: dateFilter !== 'all' ? dateFilter : undefined,
  })
  const { mutate: deleteCall } = useDeleteCall()
  
  // Extract calls from response - Laravel returns paginated: {data: [...], total, current_page, ...}
  const calls = callsData?.data || []
  
  // Extract unique campaigns for filter
  const campaigns = [...new Set(calls.map(c => c.campaign?.name).filter(Boolean))]
  
  // Handle call deletion
  const handleDelete = (callId, leadName) => {
    if (window.confirm(`Are you sure you want to delete call with ${leadName}?`)) {
      deleteCall(callId)
    }
  }
  
  // Outcome badge styles
  const outcomeStyles = {
    success: 'bg-success-100 text-success-700',
    voicemail: 'bg-warning-100 text-warning-700',
    no_answer: 'bg-slate-100 text-slate-700',
    busy: 'bg-danger-100 text-danger-700',
  }
  
  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />
      case 'voicemail':
        return <AlertCircle className="w-4 h-4" />
      case 'no_answer':
      case 'busy':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }
  
  const getOutcomeLabel = (outcome) => {
    const labels = {
      success: 'Success',
      voicemail: 'Voicemail',
      no_answer: 'No Answer',
      busy: 'Busy'
    }
    return labels[outcome] || outcome
  }
  
  // Client-side filtering is minimal since backend handles main filtering
  const filteredCalls = calls
  
  // Calculate stats
  const totalCalls = calls.length
  const successfulCalls = calls.filter(c => c.outcome === 'success').length
  
  // Calculate average duration - handle both integer (seconds) and string (MM:SS) formats
  const avgDuration = calls.length > 0 ? calls.reduce((acc, call) => {
    if (!call.duration) return acc
    
    // If duration is a number (seconds from backend)
    if (typeof call.duration === 'number') {
      return acc + (call.duration / 60) // Convert seconds to minutes
    }
    
    // If duration is a string in "MM:SS" format
    if (typeof call.duration === 'string' && call.duration.includes(':')) {
      const [mins, secs] = call.duration.split(':').map(Number)
      return acc + mins + (secs / 60)
    }
    
    return acc
  }, 0) / calls.length : 0
  
  const aiCalls = calls.filter(c => c.type === 'AI_CALL').length
  
  // Helper function to format duration for display
  const formatDuration = (duration) => {
    if (!duration) return '0:00'
    
    // If already a string in MM:SS format, return as-is
    if (typeof duration === 'string') return duration
    
    // If number (seconds), convert to MM:SS format
    if (typeof duration === 'number') {
      const mins = Math.floor(duration / 60)
      const secs = duration % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
    
    return '0:00'
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Calls</h1>
          <p className="body-text text-slate-600 mt-2">View and manage all call activities</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="btn btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Log Call
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Calls</p>
              <p className="text-2xl font-bold text-slate-900">{totalCalls}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <Phone className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Successful</p>
              <p className="text-2xl font-bold text-slate-900">{successfulCalls}</p>
              <p className="text-xs text-success-600 mt-1">
                {((successfulCalls / totalCalls) * 100).toFixed(0)}% success rate
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Avg Duration</p>
              <p className="text-2xl font-bold text-slate-900">{avgDuration.toFixed(1)} min</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-warning-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">AI Calls</p>
              <p className="text-2xl font-bold text-slate-900">{aiCalls}</p>
              <p className="text-xs text-purple-600 mt-1">
                {((aiCalls / totalCalls) * 100).toFixed(0)}% automated
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
          </div>
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
                placeholder="Search by lead name or company..."
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200">
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
            
            {/* Outcome Filter */}
            <div>
              <label className="label-text mb-2">Outcome</label>
              <select
                value={outcomeFilter}
                onChange={(e) => setOutcomeFilter(e.target.value)}
                className="input w-full"
              >
                <option value="all">All Outcomes</option>
                <option value="success">Success</option>
                <option value="voicemail">Voicemail</option>
                <option value="no_answer">No Answer</option>
                <option value="busy">Busy</option>
              </select>
            </div>
            
            {/* Date Filter */}
            <div>
              <label className="label-text mb-2">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input w-full"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Calls Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Lead</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Campaign</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Duration</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Outcome</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">AI Summary</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* Loading State */}
              {isLoading && (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
                  </td>
                </tr>
              )}
              
              {/* Error State */}
              {error && (
                <tr>
                  <td colSpan="6" className="p-8">
                    <div className="text-center text-danger-700">
                      Failed to load calls. Please try again.
                    </div>
                  </td>
                </tr>
              )}
              
              {/* Data Rows */}
              {!isLoading && !error && filteredCalls.map((call) => (
                <tr 
                  key={call.id}
                  onClick={() => navigate(`/dashboard/calls/${call.id}`)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${call.type === 'AI_CALL' ? 'bg-purple-100' : 'bg-primary-100'} flex items-center justify-center`}>
                        {call.type === 'AI_CALL' ? (
                          <Sparkles className={`w-5 h-5 ${call.type === 'AI_CALL' ? 'text-purple-600' : 'text-primary-600'}`} />
                        ) : (
                          <Phone className="w-5 h-5 text-primary-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{call.lead?.name || call.lead_name}</div>
                        <div className="text-sm text-slate-500">{call.lead?.company || call.lead_company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-slate-700">{call.campaign?.name || call.campaign || '-'}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-900">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {formatDuration(call.duration)}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1 badge ${outcomeStyles[call.outcome]}`}>
                      {getOutcomeIcon(call.outcome)}
                      {getOutcomeLabel(call.outcome)}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-slate-600 line-clamp-2">{call.ai_summary}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(call.created_at || call.date).toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredCalls.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Phone className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No calls found</h3>
            <p className="text-slate-600">
              {searchQuery || campaignFilter !== 'all' || outcomeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No calls have been logged yet'}
            </p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredCalls.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing {filteredCalls.length} of {calls.length} calls
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

