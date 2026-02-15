import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Plug,
  CheckCircle,
  XCircle,
  Settings,
  MessageSquare,
  Phone,
  Bot,
  Globe,
  Mail,
  Loader2
} from 'lucide-react'
import { useIntegrations } from '@/hooks/useIntegrations'

export default function Integrations() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Fetch integrations from backend
  const { data: integrationsData, isLoading, error } = useIntegrations({
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  })
  
  // Extract integrations from response - Laravel may return {integrations: [...]} or {data: [...]}
  const integrations = integrationsData?.integrations || integrationsData?.data || []
  
  // Apply filters
  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || integration.status === statusFilter
    return matchesSearch && matchesStatus
  })
  
  // Calculate stats
  const totalIntegrations = integrations.length
  const activeIntegrations = integrations.filter(i => i.status === 'active').length
  const inactiveIntegrations = integrations.filter(i => i.status === 'inactive').length
  
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
              <p className="text-2xl font-bold text-slate-900">{totalIntegrations}</p>
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
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          
          {/* Status Filter */}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-slate-600">Loading integrations...</p>
            </div>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-12">
            <div className="text-danger-600 mb-2">Failed to load integrations</div>
            <p className="text-sm text-slate-600">{error.message}</p>
          </div>
        ) : filteredIntegrations.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Plug className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No integrations found</p>
          </div>
        ) : (
          filteredIntegrations.map((integration) => {
          const IconComponent = integration.icon
          return (
            <div 
              key={integration.id}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/dashboard/integrations/${integration.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${integration.color}`}>
                  <IconComponent className="w-7 h-7" />
                </div>
                <span className={`badge ${
                  integration.status === 'active'
                    ? 'bg-success-100 text-success-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {integration.status === 'active' ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      Inactive
                    </>
                  )}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2">{integration.name}</h3>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{integration.description}</p>
              
              <div className="space-y-3 mb-4 pb-4 border-b border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Category</span>
                  <span className="font-medium text-slate-900">{integration.category}</span>
                </div>
                
                {integration.last_synced && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Last Synced</span>
                    <span className="font-medium text-slate-900">
                      {new Date(integration.last_synced).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Features List */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Features
                </p>
                <div className="flex flex-wrap gap-2">
                  {integration.features.slice(0, 3).map((feature, idx) => (
                    <span key={idx} className="badge badge-sm bg-slate-100 text-slate-700">
                      {feature}
                    </span>
                  ))}
                  {integration.features.length > 3 && (
                    <span className="badge badge-sm bg-slate-100 text-slate-700">
                      +{integration.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              
              <button className="btn btn-primary btn-sm w-full">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </button>
            </div>
          )
        })
        )}
      </div>
      
      {/* Empty State */}
      {filteredIntegrations.length === 0 && (
        <div className="card">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Plug className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No integrations found</h3>
            <p className="text-slate-600">
              {searchQuery ? 'Try adjusting your search' : 'No integrations available'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
