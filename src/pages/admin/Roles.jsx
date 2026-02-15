import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Shield,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  Lock,
  Loader2
} from 'lucide-react'
import { useRoles, useDeleteRole } from '@/hooks/useRoles'
import toast from 'react-hot-toast'

export default function Roles() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState(null)
  
  // Fetch roles from backend
  const { data: rolesData, isLoading, error } = useRoles({ search: searchQuery || undefined })
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole()
  
  // Extract roles from response - Laravel may return {roles: [...]} or {data: [...]}
  const roles = rolesData?.roles || rolesData?.data || []
  
  const handleDelete = (role) => {
    if (role.is_system) {
      toast.error('System roles cannot be deleted')
      return
    }
    if (window.confirm(`Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`)) {
      deleteRole(role.id)
    }
  }
  
  // Apply search filter
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Calculate stats
  const totalRoles = roles.length
  const customRoles = roles.filter(r => !r.is_system).length
  const totalUsers = roles.reduce((sum, r) => sum + r.users_count, 0)
  const avgPermissions = roles.reduce((sum, r) => sum + r.permissions_count, 0) / totalRoles
  
  const getColorClasses = (color) => {
    const colors = {
      danger: 'bg-danger-100 text-danger-600',
      warning: 'bg-warning-100 text-warning-600',
      primary: 'bg-primary-100 text-primary-600',
      success: 'bg-success-100 text-success-600',
      blue: 'bg-blue-100 text-blue-600',
    }
    return colors[color] || 'bg-slate-100 text-slate-600'
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Roles & Permissions</h1>
          <p className="body-text text-slate-600 mt-2">Manage user roles and permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Create Role
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Roles</p>
              <p className="text-2xl font-bold text-slate-900">{totalRoles}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Custom Roles</p>
              <p className="text-2xl font-bold text-slate-900">{customRoles}</p>
              <p className="text-xs text-slate-500 mt-1">User-created</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success-100 flex items-center justify-center">
              <Edit className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{totalUsers}</p>
              <p className="text-xs text-slate-500 mt-1">Across all roles</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Avg Permissions</p>
              <p className="text-2xl font-bold text-slate-900">{avgPermissions.toFixed(0)}</p>
              <p className="text-xs text-slate-500 mt-1">per role</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-warning-100 flex items-center justify-center">
              <Lock className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
      </div>
      
      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-slate-600">Loading roles...</p>
            </div>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-12">
            <div className="text-danger-600 mb-2">Failed to load roles</div>
            <p className="text-sm text-slate-600">{error.message}</p>
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No roles found</p>
          </div>
        ) : (
          filteredRoles.map((role) => (
          <div key={role.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(role.color)}`}>
                <Shield className="w-6 h-6" />
              </div>
              {role.is_system && (
                <span className="badge badge-sm bg-slate-100 text-slate-600">
                  <Lock className="w-3 h-3 mr-1" />
                  System
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-2">{role.name}</h3>
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{role.description}</p>
            
            <div className="space-y-3 mb-4 pb-4 border-b border-slate-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Permissions
                </span>
                <span className="font-semibold text-slate-900">{role.permissions_count}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Users
                </span>
                <span className="font-semibold text-slate-900">{role.users_count}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/dashboard/admin/roles/${role.id}`)}
                className="btn btn-primary btn-sm flex-1"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(role)}
                disabled={role.is_system}
                className={`btn btn-sm ${
                  role.is_system 
                    ? 'btn-outline opacity-50 cursor-not-allowed' 
                    : 'bg-danger-100 text-danger-600 hover:bg-danger-200'
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
        )}
      </div>
      
      {/* Empty State */}
      {filteredRoles.length === 0 && (
        <div className="card">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Shield className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No roles found</h3>
            <p className="text-slate-600">
              {searchQuery ? 'Try adjusting your search' : 'No roles available'}
            </p>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-danger-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-danger-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delete Role</h3>
                <p className="text-sm text-slate-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-slate-700 mb-6">
              Are you sure you want to delete the role <span className="font-semibold">"{roleToDelete?.name}"</span>? 
              {roleToDelete?.users_count > 0 && (
                <span className="block mt-2 text-danger-600">
                  Warning: {roleToDelete.users_count} user(s) are currently assigned to this role.
                </span>
              )}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 btn bg-danger-600 hover:bg-danger-700 text-white"
              >
                Delete Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
