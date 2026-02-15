import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Filter,
  Phone,
  Mail,
  MessageSquare,
  Bot,
  Calendar,
  User,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Loader2
} from 'lucide-react'
import { useCommunicationLogs } from '@/hooks/useCommunicationLogs'
import toast from 'react-hot-toast'

export default function Communications() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  
  // Fetch communications from backend with filters
  const { data: communicationsData, isLoading, error } = useCommunicationLogs({
    search: searchQuery || undefined,
    type: typeFilter !== 'all' ? typeFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    date_range: dateRange !== 'all' ? dateRange : undefined,
  })
  
  // Extract communications from response
  const communications = communicationsData?.logs || []
  const totalCommunications = communicationsData?.total || 0
  
  // Type icons and styles
  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'call':
      case 'phone_call':
        return <Phone className="w-4 h-4" />
      case 'email':
        return <Mail className="w-4 h-4" />
      case 'sms':
        return <MessageCircle className="w-4 h-4" />
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4" />
      case 'meeting':
        return <Calendar className="w-4 h-4" />
      case 'chat':
        return <MessageSquare className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
  }
  
  const getTypeStyle = (type) => {
    const typeKey = type?.toLowerCase()
    const styles = {
      call: 'bg-primary-100 text-primary-700',
      phone_call: 'bg-primary-100 text-primary-700',
      email: 'bg-blue-100 text-blue-700',
      sms: 'bg-purple-100 text-purple-700',
      whatsapp: 'bg-success-100 text-success-700',
      meeting: 'bg-warning-100 text-warning-700',
      chat: 'bg-slate-100 text-slate-700',
    }
    return styles[typeKey] || 'bg-slate-100 text-slate-700'
  }
  
  const getTypeLabel = (type) => {
    const typeKey = type?.toLowerCase()
    const labels = {
      call: 'Call',
      phone_call: 'Phone Call',
      email: 'Email',
      sms: 'SMS',
      whatsapp: 'WhatsApp',
      meeting: 'Meeting',
      chat: 'Chat',
    }
    return labels[typeKey] || type
  }
  
  const getOutcomeStyle = (status) => {
    const statusKey = status?.toLowerCase()
    const styles = {
      completed: 'bg-success-100 text-success-700',
      sent: 'bg-success-100 text-success-700',
      delivered: 'bg-success-100 text-success-700',
      opened: 'bg-blue-100 text-blue-700',
      clicked: 'bg-primary-100 text-primary-700',
      missed: 'bg-warning-100 text-warning-700',
      voicemail: 'bg-warning-100 text-warning-700',
      busy: 'bg-warning-100 text-warning-700',
      failed: 'bg-danger-100 text-danger-700',
      bounced: 'bg-danger-100 text-danger-700',
    }
    return styles[statusKey] || 'bg-slate-100 text-slate-700'
  }
  
  // Apply filters
  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = (comm.lead?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (comm.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (comm.notes || '').toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = typeFilter === 'all' || comm.type?.toLowerCase() === typeFilter.toLowerCase()
    
    const matchesStatus = statusFilter === 'all' || comm.status?.toLowerCase() === statusFilter.toLowerCase()
    
    let matchesDate = true
    if (dateRange !== 'all' && comm.created_at) {
      const commDate = new Date(comm.created_at)
      const today = new Date()
      const diffDays = Math.floor((today - commDate) / (1000 * 60 * 60 * 24))
      
      if (dateRange === 'today') matchesDate = diffDays === 0
      else if (dateRange === 'week') matchesDate = diffDays <= 7
      else if (dateRange === 'month') matchesDate = diffDays <= 30
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDate
  })
  
  // Calculate stats
  const totalComms = communications.length
  const calls = communications.filter(c => c.type?.toLowerCase() === 'call' || c.type?.toLowerCase() === 'phone_call').length
  const aiCalls = communications.filter(c => 
    (c.type?.toLowerCase() === 'call' || c.type?.toLowerCase() === 'phone_call') && 
    c.reference_id && c.reference_id.startsWith('ai_')
  ).length
  const emails = communications.filter(c => c.type?.toLowerCase() === 'email').length
  const successfulContacts = communications.filter(c => 
    c.status?.toLowerCase() === 'completed' || 
    c.status?.toLowerCase() === 'delivered' ||
    c.status?.toLowerCase() === 'opened'
  ).length
  const successRate = totalComms > 0 ? ((successfulContacts / totalComms) * 100).toFixed(0) : 0
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Communications</h1>
          <p className="body-text text-slate-600 mt-2">All communication logs across channels</p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Communications</p>
              <p className="text-2xl font-bold text-slate-900">{totalComms}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Calls</p>
              <p className="text-2xl font-bold text-slate-900">{calls}</p>
              <p className="text-xs text-primary-600 mt-1">
                {totalComms > 0 ? ((calls / totalComms) * 100).toFixed(0) : 0}% of total
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <Phone className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">AI Calls</p>
              <p className="text-2xl font-bold text-slate-900">{aiCalls}</p>
              <p className="text-xs text-purple-600 mt-1">
                {calls > 0 ? ((aiCalls / calls) * 100).toFixed(0) : 0}% AI-powered
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Bot className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Emails Sent</p>
              <p className="text-2xl font-bold text-slate-900">{emails}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-slate-900">{successRate}%</p>
              <p className="text-xs text-success-600 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {successfulContacts} successful
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success-600" />
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
                placeholder="Search by lead name, subject, or company..."
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
            {/* Type Filter */}
            <div>
              <label className="label-text mb-2">Communication Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="input w-full"
              >
                <option value="all">All Types</option>
                <option value="call">Calls</option>
                <option value="email">Emails</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="meeting">Meetings</option>
                <option value="chat">Chats</option>
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
                <option value="completed">Completed</option>
                <option value="sent">Sent</option>
                <option value="delivered">Delivered</option>
                <option value="opened">Opened</option>
                <option value="clicked">Clicked</option>
                <option value="missed">Missed</option>
                <option value="voicemail">Voicemail</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            {/* Date Range Filter */}
            <div>
              <label className="label-text mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
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
      
      {/* Communications Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Lead</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Campaign</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Details</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Created By</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
                    <p className="text-slate-600">Loading communications...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <div className="text-danger-600 mb-2">Failed to load communications</div>
                    <p className="text-sm text-slate-600">{error.message}</p>
                  </td>
                </tr>
              ) : filteredCommunications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <MessageCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600">No communications found</p>
                  </td>
                </tr>
              ) : (
                filteredCommunications.map((comm) => (
                <tr 
                  key={comm.id}
                  onClick={() => navigate(`/dashboard/leads/${comm.lead_id}`)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="p-4">
                    <span className={`flex items-center gap-2 badge ${getTypeStyle(comm.type)}`}>
                      {getTypeIcon(comm.type)}
                      {getTypeLabel(comm.type)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{comm.lead?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-500">{comm.lead?.email || '-'}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="max-w-xs">
                      <div className="text-sm font-medium text-slate-900 mb-1">{comm.subject || 'No subject'}</div>
                      <div className="text-xs text-slate-500 line-clamp-2">{comm.notes || '-'}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-slate-700">{comm.campaign?.name || '-'}</span>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {comm.duration && (
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Clock className="w-3 h-3" />
                          {comm.duration}
                        </div>
                      )}
                      {comm.status && (
                        <span className={`badge badge-sm ${getOutcomeStyle(comm.status)} capitalize`}>
                          {comm.status}
                        </span>
                      )}
                      {comm.direction && (
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          {comm.direction === 'inbound' ? '←' : '→'} {comm.direction}
                        </div>
                      )}
                      {comm.reference_id && comm.reference_id.startsWith('ai_') && (
                        <span className="badge badge-sm bg-purple-100 text-purple-700">
                          <Bot className="w-3 h-3 mr-1" />
                          AI Call
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="text-sm text-slate-700">{comm.creator?.name || 'System'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-900">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(comm.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(comm.created_at).toLocaleTimeString()}
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredCommunications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No communications found</h3>
            <p className="text-slate-600">
              {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No communication logs available'}
            </p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredCommunications.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing {filteredCommunications.length} of {communications.length} communications
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
