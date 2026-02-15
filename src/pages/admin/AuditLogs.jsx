import { useState } from 'react'
import { 
  Search, 
  Filter,
  Shield,
  ChevronDown,
  ChevronRight,
  User,
  Clock,
  FileText,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Loader2
} from 'lucide-react'
import { useAuditLogs } from '@/hooks/useAuditLogs'

export default function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState('')
  const [modelFilter, setModelFilter] = useState('all')
  const [userFilter, setUserFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [expandedRows, setExpandedRows] = useState(new Set())
  
  // Fetch audit logs from backend
  const { data: auditLogsData, isLoading, error } = useAuditLogs({
    search: searchQuery || undefined,
    model: modelFilter !== 'all' ? modelFilter : undefined,
    user_id: userFilter !== 'all' ? userFilter : undefined,
    date_range: dateRange !== 'all' ? dateRange : undefined,
  })
  
  // Extract audit logs from response - Laravel may return {audit_logs: [...]} or {data: [...]}
  const auditLogs = auditLogsData?.audit_logs || auditLogsData?.data || []
  
  const users = ['Jane Doe', 'Mike Wilson', 'Tom Chen', 'Sarah Lee']
  const modelTypes = ['Lead', 'Campaign', 'Task', 'User', 'Role', 'Communication']
  
  const getActionIcon = (action) => {
    switch (action) {
      case 'create':
        return <Plus className="w-4 h-4" />
      case 'update':
        return <Edit className="w-4 h-4" />
      case 'delete':
        return <Trash2 className="w-4 h-4" />
      case 'view':
        return <Eye className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }
  
  const getActionColor = (action) => {
    const colors = {
      create: 'bg-success-100 text-success-700',
      update: 'bg-primary-100 text-primary-700',
      delete: 'bg-danger-100 text-danger-700',
      view: 'bg-blue-100 text-blue-700',
    }
    return colors[action] || 'bg-slate-100 text-slate-700'
  }
  
  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }
  
  // Apply filters
  const filteredLogs = auditLogs.filter(log => {
    // Safely extract model type from auditable_type (e.g., "App\\Models\\Lead" -> "Lead")
    const modelType = log.auditable_type ? log.auditable_type.split('\\').pop() : ''
    const userName = log.user?.name || log.user?.email || ''
    
    const matchesSearch = modelType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (log.auditable_id && log.auditable_id.toString().includes(searchQuery))
    const matchesModel = modelFilter === 'all' || modelType === modelFilter
    const matchesUser = userFilter === 'all' || userName === userFilter
    
    let matchesDate = true
    if (dateRange !== 'all') {
      const logDate = new Date(log.created_at)
      const today = new Date()
      const diffDays = Math.floor((today - logDate) / (1000 * 60 * 60 * 24))
      
      if (dateRange === 'today') matchesDate = diffDays === 0
      else if (dateRange === 'week') matchesDate = diffDays <= 7
      else if (dateRange === 'month') matchesDate = diffDays <= 30
    }
    
    return matchesSearch && matchesModel && matchesUser && matchesDate
  })
  
  // Calculate stats
  const totalLogs = auditLogs.length
  const createActions = auditLogs.filter(l => l.action === 'create').length
  const updateActions = auditLogs.filter(l => l.action === 'update').length
  const deleteActions = auditLogs.filter(l => l.action === 'delete').length
  
  const handleExport = () => {
    // Export logs to CSV
    console.log('Exporting audit logs...')
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <p className="body-text text-slate-600 mt-2">View system activity and audit trail</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="btn btn-outline">
            <Download className="w-5 h-5 mr-2" />
            Export
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Logs</p>
              <p className="text-2xl font-bold text-slate-900">{totalLogs}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Created</p>
              <p className="text-2xl font-bold text-slate-900">{createActions}</p>
              <p className="text-xs text-success-600 mt-1">New records</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success-100 flex items-center justify-center">
              <Plus className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Updated</p>
              <p className="text-2xl font-bold text-slate-900">{updateActions}</p>
              <p className="text-xs text-primary-600 mt-1">Modifications</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <Edit className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Deleted</p>
              <p className="text-2xl font-bold text-slate-900">{deleteActions}</p>
              <p className="text-xs text-danger-600 mt-1">Removed</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-danger-100 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-danger-600" />
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
                placeholder="Search by record name or user..."
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
            {/* Model Type Filter */}
            <div>
              <label className="label-text mb-2">Model Type</label>
              <select
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
                className="input w-full"
              >
                <option value="all">All Models</option>
                {modelTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* User Filter */}
            <div>
              <label className="label-text mb-2">User</label>
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="input w-full"
              >
                <option value="all">All Users</option>
                {users.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
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
      
      {/* Audit Logs Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider w-12"></th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">User</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Model</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Record</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
                    <p className="text-slate-600">Loading audit logs...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="text-danger-600 mb-2">Failed to load audit logs</div>
                    <p className="text-sm text-slate-600">{error.message}</p>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <Shield className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600">No audit logs found</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                <>
                  <tr 
                    key={log.id}
                    onClick={() => toggleRow(log.id)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <button className="text-slate-400 hover:text-slate-600">
                        {expandedRows.has(log.id) ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <span className={`flex items-center gap-2 badge ${getActionColor(log.action)} capitalize`}>
                        {getActionIcon(log.action)}
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{log.user?.name || log.user?.email || 'Unknown'}</div>
                          <div className="text-xs text-slate-500">{log.ip_address || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="badge bg-slate-100 text-slate-700">
                        <FileText className="w-4 h-4 mr-1" />
                        {log.auditable_type ? log.auditable_type.split('\\').pop() : 'Unknown'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {log.auditable_type ? log.auditable_type.split('\\').pop() : 'Unknown'}
                        </div>
                        <div className="text-xs text-slate-500">ID: {log.auditable_id || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-900">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {new Date(log.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Row - Changes Details */}
                  {expandedRows.has(log.id) && (
                    <tr>
                      <td colSpan="6" className="p-0 bg-slate-50">
                        <div className="p-6">
                          <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Changes Details
                          </h4>
                          
                          {/* Show old and new values if they exist */}
                          {(log.old_values || log.new_values) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Get all unique keys from both old and new values */}
                              {Array.from(new Set([
                                ...Object.keys(log.old_values || {}),
                                ...Object.keys(log.new_values || {})
                              ])).map(field => (
                                <div key={field} className="bg-white rounded-lg p-4 border border-slate-200">
                                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                    {field.replace(/_/g, ' ')}
                                  </div>
                                  
                                  <div className="space-y-3">
                                    {/* Before */}
                                    <div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <XCircle className="w-4 h-4 text-danger-500" />
                                        <span className="text-xs font-semibold text-slate-600">Before</span>
                                      </div>
                                      <div className={`p-3 rounded-lg ${
                                        !log.old_values || log.old_values[field] === null || log.old_values[field] === undefined
                                          ? 'bg-slate-100 text-slate-400 italic' 
                                          : 'bg-danger-50 text-danger-900'
                                      }`}>
                                        <code className="text-sm">
                                          {!log.old_values || log.old_values[field] === null || log.old_values[field] === undefined
                                            ? 'null' 
                                            : typeof log.old_values[field] === 'object'
                                              ? JSON.stringify(log.old_values[field], null, 2)
                                              : String(log.old_values[field])}
                                        </code>
                                      </div>
                                    </div>
                                    
                                    {/* After */}
                                    <div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle className="w-4 h-4 text-success-500" />
                                        <span className="text-xs font-semibold text-slate-600">After</span>
                                      </div>
                                      <div className={`p-3 rounded-lg ${
                                        !log.new_values || log.new_values[field] === null || log.new_values[field] === undefined
                                          ? 'bg-slate-100 text-slate-400 italic' 
                                          : 'bg-success-50 text-success-900'
                                      }`}>
                                        <code className="text-sm">
                                          {!log.new_values || log.new_values[field] === null || log.new_values[field] === undefined
                                            ? 'null' 
                                            : typeof log.new_values[field] === 'object'
                                              ? JSON.stringify(log.new_values[field], null, 2)
                                              : String(log.new_values[field])}
                                        </code>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-slate-500">
                              <p>No change details available for this action</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Shield className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No audit logs found</h3>
            <p className="text-slate-600">
              {searchQuery || modelFilter !== 'all' || userFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No audit logs available'}
            </p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredLogs.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing {filteredLogs.length} of {auditLogs.length} logs
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
