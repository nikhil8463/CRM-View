import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Target,
  Activity,
  Edit,
  Save,
  X,
  CheckCircle,
  XCircle,
  Building2,
  Clock,
  TrendingUp,
  PhoneCall,
  Send,
  Eye
} from 'lucide-react'

export default function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(null)
  
  // Mock data - replace with actual API call
  const user = {
    id: parseInt(id),
    name: 'Jane Doe',
    email: 'jane.doe@company.com',
    phone: '+1 (555) 123-4567',
    role: 'Sales Manager',
    role_id: 2,
    status: 'active',
    joined_date: '2025-01-15',
    last_active: '2026-02-14T14:30:00Z',
    department: 'Sales',
    reports_to: 'Sarah Lee',
    
    assigned_campaigns: [
      {
        id: 1,
        name: 'Q1 Enterprise Outreach',
        status: 'active',
        leads_assigned: 15,
        completion: 65
      },
      {
        id: 2,
        name: 'Product Launch',
        status: 'active',
        leads_assigned: 8,
        completion: 42
      },
    ],
    
    activity_logs: [
      {
        id: 1,
        type: 'call',
        action: 'Completed AI call with John Smith',
        lead: 'John Smith',
        campaign: 'Q1 Enterprise Outreach',
        timestamp: '2026-02-14T14:30:00Z',
        outcome: 'success'
      },
      {
        id: 2,
        type: 'email',
        action: 'Sent proposal email to Sarah Johnson',
        lead: 'Sarah Johnson',
        campaign: 'Product Launch',
        timestamp: '2026-02-14T13:15:00Z',
        outcome: 'sent'
      },
      {
        id: 3,
        type: 'lead',
        action: 'Updated lead status to Qualified',
        lead: 'Mike Davis',
        campaign: 'Q1 Enterprise Outreach',
        timestamp: '2026-02-14T11:45:00Z',
        outcome: 'updated'
      },
      {
        id: 4,
        type: 'call',
        action: 'Manual call with Emily Brown',
        lead: 'Emily Brown',
        campaign: 'Product Launch',
        timestamp: '2026-02-14T10:20:00Z',
        outcome: 'voicemail'
      },
      {
        id: 5,
        type: 'task',
        action: 'Created follow-up task for Robert Wilson',
        lead: 'Robert Wilson',
        campaign: 'Q1 Enterprise Outreach',
        timestamp: '2026-02-13T16:00:00Z',
        outcome: 'created'
      },
    ],
    
    stats: {
      total_calls: 45,
      successful_calls: 32,
      emails_sent: 68,
      emails_opened: 52,
      leads_qualified: 12,
      tasks_completed: 28
    }
  }
  
  const handleEdit = () => {
    setEditedUser({ ...user })
    setIsEditing(true)
  }
  
  const handleSave = () => {
    // Save changes via API
    setIsEditing(false)
  }
  
  const handleCancel = () => {
    setEditedUser(null)
    setIsEditing(false)
  }
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'call':
        return <PhoneCall className="w-4 h-4" />
      case 'email':
        return <Mail className="w-4 h-4" />
      case 'lead':
        return <User className="w-4 h-4" />
      case 'task':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }
  
  const getActivityColor = (type) => {
    const colors = {
      call: 'bg-primary-100 text-primary-600',
      email: 'bg-blue-100 text-blue-600',
      lead: 'bg-success-100 text-success-600',
      task: 'bg-warning-100 text-warning-600',
    }
    return colors[type] || 'bg-slate-100 text-slate-600'
  }
  
  const currentData = isEditing ? editedUser : user
  
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/admin/users')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Users</span>
      </button>
      
      {/* Header Card */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600">
                {currentData.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="input mb-2 text-2xl font-bold"
                />
              ) : (
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{currentData.name}</h1>
              )}
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`badge ${
                  currentData.role === 'Admin' ? 'bg-warning-100 text-warning-700' :
                  currentData.role === 'Sales Manager' ? 'bg-primary-100 text-primary-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  <Shield className="w-4 h-4 mr-1" />
                  {currentData.role}
                </span>
                <span className={`badge ${
                  currentData.status === 'active' 
                    ? 'bg-success-100 text-success-700' 
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {currentData.status === 'active' ? (
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
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        className="input input-sm"
                      />
                    ) : (
                      <p className="text-sm font-medium text-slate-900">{currentData.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedUser.phone}
                        onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                        className="input input-sm"
                      />
                    ) : (
                      <p className="text-sm font-medium text-slate-900">{currentData.phone}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Joined</p>
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(currentData.joined_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Last Active</p>
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(currentData.last_active).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="btn btn-primary">
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </button>
                <button onClick={handleCancel} className="btn btn-outline">
                  <X className="w-5 h-5 mr-2" />
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={handleEdit} className="btn btn-primary">
                <Edit className="w-5 h-5 mr-2" />
                Edit User
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Calls</p>
              <p className="text-xl font-bold text-slate-900">{user.stats.total_calls}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Successful</p>
              <p className="text-xl font-bold text-slate-900">{user.stats.successful_calls}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Send className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Emails Sent</p>
              <p className="text-xl font-bold text-slate-900">{user.stats.emails_sent}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Opened</p>
              <p className="text-xl font-bold text-slate-900">{user.stats.emails_opened}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Qualified</p>
              <p className="text-xl font-bold text-slate-900">{user.stats.leads_qualified}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Tasks Done</p>
              <p className="text-xl font-bold text-slate-900">{user.stats.tasks_completed}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info & Campaigns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="card">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-text mb-2">Department</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.department}
                    onChange={(e) => setEditedUser({ ...editedUser, department: e.target.value })}
                    className="input w-full"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm text-slate-900">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {currentData.department}
                  </div>
                )}
              </div>
              
              <div>
                <label className="label-text mb-2">Reports To</label>
                {isEditing ? (
                  <select
                    value={editedUser.reports_to}
                    onChange={(e) => setEditedUser({ ...editedUser, reports_to: e.target.value })}
                    className="input w-full"
                  >
                    <option>Sarah Lee</option>
                    <option>John Manager</option>
                    <option>Mike Director</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-slate-900">
                    <User className="w-4 h-4 text-slate-400" />
                    {currentData.reports_to}
                  </div>
                )}
              </div>
              
              <div>
                <label className="label-text mb-2">Role</label>
                {isEditing ? (
                  <select
                    value={editedUser.role}
                    onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                    className="input w-full"
                  >
                    <option>Admin</option>
                    <option>Sales Manager</option>
                    <option>Sales Rep</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-slate-900">
                    <Shield className="w-4 h-4 text-slate-400" />
                    {currentData.role}
                  </div>
                )}
              </div>
              
              <div>
                <label className="label-text mb-2">Status</label>
                {isEditing ? (
                  <select
                    value={editedUser.status}
                    onChange={(e) => setEditedUser({ ...editedUser, status: e.target.value })}
                    className="input w-full"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                ) : (
                  <span className={`badge ${
                    currentData.status === 'active' 
                      ? 'bg-success-100 text-success-700' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {currentData.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Campaign Assignments */}
          <div className="card">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-600" />
              Campaign Assignments ({user.assigned_campaigns.length})
            </h2>
            <div className="space-y-4">
              {user.assigned_campaigns.map((campaign) => (
                <div key={campaign.id} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{campaign.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {campaign.leads_assigned} leads
                        </span>
                        <span className={`badge badge-sm ${
                          campaign.status === 'active' 
                            ? 'bg-success-100 text-success-700' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/dashboard/campaigns/${campaign.id}`)}
                      className="btn btn-outline btn-sm"
                    >
                      View
                    </button>
                  </div>
                  
                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                      <span>Completion</span>
                      <span className="font-semibold">{campaign.completion}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-600 rounded-full transition-all"
                        style={{ width: `${campaign.completion}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {user.assigned_campaigns.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No campaigns assigned yet
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column - Activity Logs */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" />
              Recent Activity
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {user.activity_logs.map((log) => (
                <div key={log.id} className="pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(log.type)}`}>
                      {getActivityIcon(log.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 mb-1">{log.action}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span className="font-medium">{log.lead}</span>
                        <span>•</span>
                        <span>{log.campaign}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
