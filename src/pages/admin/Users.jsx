import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter,
  Users as UsersIcon,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  Target,
  Activity,
  Edit,
  ToggleLeft,
  ToggleRight,
  Loader2
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useUsers, useToggleUserStatus, useDeleteUser } from '@/hooks/useUsers'
import toast from 'react-hot-toast'

export default function Users() {
  const navigate = useNavigate()
  const { user: currentUser } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  
  // Fetch users from backend
  const { data: usersData, isLoading, error } = useUsers({
    search: searchQuery || undefined,
    role: roleFilter !== 'all' ? roleFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  })
  
  const { mutate: toggleStatus, isPending: isToggling } = useToggleUserStatus()
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser()
  
  // Extract users from response - Laravel returns paginated: {data: [...], total, current_page, ...}
  const users = usersData?.data || []
  
  // Handle toggle user status
  const handleToggleStatus = (userId) => {
    if (window.confirm('Are you sure you want to toggle this user\'s status?')) {
      toggleStatus(userId)
    }
  }
  
  // Handle delete user
  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUser(userId, {
        onSuccess: () => {
          toast.success('User deleted successfully!')
        }
      })
    }
  }
  
  // Apply filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })
  
  // Calculate stats
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'active').length
  const adminUsers = users.filter(u => u.role === 'Admin').length
  const avgCampaigns = users.reduce((sum, u) => sum + u.campaigns_count, 0) / totalUsers
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="body-text text-slate-600 mt-2">Manage users and permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Add User
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{totalUsers}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Active Users</p>
              <p className="text-2xl font-bold text-slate-900">{activeUsers}</p>
              <p className="text-xs text-success-600 mt-1">
                {((activeUsers / totalUsers) * 100).toFixed(0)}% of total
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
              <p className="text-sm text-slate-600 mb-1">Administrators</p>
              <p className="text-2xl font-bold text-slate-900">{adminUsers}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-warning-100 flex items-center justify-center">
              <Shield className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Avg Campaigns</p>
              <p className="text-2xl font-bold text-slate-900">{avgCampaigns.toFixed(1)}</p>
              <p className="text-xs text-slate-500 mt-1">per user</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
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
                placeholder="Search by name or email..."
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
            {/* Role Filter */}
            <div>
              <label className="label-text mb-2">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input w-full"
              >
                <option value="all">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Sales Manager">Sales Manager</option>
                <option value="Sales Rep">Sales Rep</option>
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Users Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Role</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Assigned Campaigns</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Active</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
                    <p className="text-slate-600">Loading users...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <div className="text-danger-600 mb-2">Failed to load users</div>
                    <p className="text-sm text-slate-600">{error.message}</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <UsersIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600">No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                <tr 
                  key={user.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary-600">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">{user.name}</div>
                        <div className="text-xs text-slate-500">Joined {new Date(user.joined_date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-700">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-slate-400" />
                      <span className={`badge ${
                        user.role === 'Admin' ? 'bg-warning-100 text-warning-700' :
                        user.role === 'Sales Manager' ? 'bg-primary-100 text-primary-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`badge ${
                      user.status === 'active' 
                        ? 'bg-success-100 text-success-700' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {user.status === 'active' ? (
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
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900 mb-1">
                        <Target className="w-4 h-4 text-slate-400" />
                        {user.campaigns_count} Campaign{user.campaigns_count !== 1 ? 's' : ''}
                      </div>
                      {user.assigned_campaigns.length > 0 && (
                        <div className="text-xs text-slate-500 line-clamp-1">
                          {user.assigned_campaigns.join(', ')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Activity className="w-4 h-4 text-slate-400" />
                      {new Date(user.last_active).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(user.last_active).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/admin/users/${user.id}`)}
                        className="btn btn-outline btn-sm"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`btn btn-sm ${
                          user.status === 'active' 
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                            : 'bg-success-100 text-success-700 hover:bg-success-200'
                        }`}
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {user.status === 'active' ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <UsersIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No users found</h3>
            <p className="text-slate-600">
              {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No users available'}
            </p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing {filteredUsers.length} of {users.length} users
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
