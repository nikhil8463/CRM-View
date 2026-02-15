import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  Shield,
  Save,
  Edit,
  X,
  CheckCircle,
  Users,
  Lock
} from 'lucide-react'

export default function RoleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editedRole, setEditedRole] = useState(null)
  
  // Mock data - replace with actual API call
  const role = {
    id: parseInt(id),
    name: 'Sales Manager',
    description: 'Manage campaigns, leads, and team members with elevated permissions',
    color: 'primary',
    is_system: false,
    users_count: 5,
    created_at: '2024-02-15',
    
    permissions: {
      campaigns: {
        label: 'Campaigns',
        permissions: [
          { id: 'campaigns.view', label: 'View Campaigns', enabled: true },
          { id: 'campaigns.create', label: 'Create Campaigns', enabled: true },
          { id: 'campaigns.edit', label: 'Edit Campaigns', enabled: true },
          { id: 'campaigns.delete', label: 'Delete Campaigns', enabled: false },
          { id: 'campaigns.assign', label: 'Assign Campaigns', enabled: true },
        ]
      },
      leads: {
        label: 'Leads',
        permissions: [
          { id: 'leads.view', label: 'View Leads', enabled: true },
          { id: 'leads.create', label: 'Create Leads', enabled: true },
          { id: 'leads.edit', label: 'Edit Leads', enabled: true },
          { id: 'leads.delete', label: 'Delete Leads', enabled: false },
          { id: 'leads.export', label: 'Export Leads', enabled: true },
          { id: 'leads.import', label: 'Import Leads', enabled: true },
        ]
      },
      communications: {
        label: 'Communications',
        permissions: [
          { id: 'communications.view', label: 'View Communications', enabled: true },
          { id: 'communications.create', label: 'Create Communications', enabled: true },
          { id: 'communications.delete', label: 'Delete Communications', enabled: false },
        ]
      },
      calls: {
        label: 'Calls',
        permissions: [
          { id: 'calls.view', label: 'View Calls', enabled: true },
          { id: 'calls.make', label: 'Make Calls', enabled: true },
          { id: 'calls.ai', label: 'Use AI Calls', enabled: true },
          { id: 'calls.download', label: 'Download Recordings', enabled: true },
        ]
      },
      tasks: {
        label: 'Tasks',
        permissions: [
          { id: 'tasks.view', label: 'View Tasks', enabled: true },
          { id: 'tasks.create', label: 'Create Tasks', enabled: true },
          { id: 'tasks.edit', label: 'Edit Tasks', enabled: true },
          { id: 'tasks.delete', label: 'Delete Tasks', enabled: false },
          { id: 'tasks.assign', label: 'Assign Tasks', enabled: true },
        ]
      },
      analytics: {
        label: 'Analytics & Reports',
        permissions: [
          { id: 'analytics.view', label: 'View Analytics', enabled: true },
          { id: 'analytics.export', label: 'Export Reports', enabled: true },
          { id: 'analytics.advanced', label: 'Advanced Analytics', enabled: false },
        ]
      },
      users: {
        label: 'User Management',
        permissions: [
          { id: 'users.view', label: 'View Users', enabled: true },
          { id: 'users.create', label: 'Create Users', enabled: false },
          { id: 'users.edit', label: 'Edit Users', enabled: false },
          { id: 'users.delete', label: 'Delete Users', enabled: false },
        ]
      },
      settings: {
        label: 'Settings',
        permissions: [
          { id: 'settings.view', label: 'View Settings', enabled: true },
          { id: 'settings.edit', label: 'Edit Settings', enabled: false },
          { id: 'settings.integrations', label: 'Manage Integrations', enabled: false },
        ]
      },
    }
  }
  
  const handleEdit = () => {
    setEditedRole(JSON.parse(JSON.stringify(role))) // Deep clone
    setIsEditing(true)
  }
  
  const handleSave = () => {
    // Save changes via API
    console.log('Saving role:', editedRole)
    setIsEditing(false)
  }
  
  const handleCancel = () => {
    setEditedRole(null)
    setIsEditing(false)
  }
  
  const togglePermission = (category, permissionId) => {
    if (!isEditing) return
    
    setEditedRole({
      ...editedRole,
      permissions: {
        ...editedRole.permissions,
        [category]: {
          ...editedRole.permissions[category],
          permissions: editedRole.permissions[category].permissions.map(p =>
            p.id === permissionId ? { ...p, enabled: !p.enabled } : p
          )
        }
      }
    })
  }
  
  const toggleAllInCategory = (category, enabled) => {
    if (!isEditing) return
    
    setEditedRole({
      ...editedRole,
      permissions: {
        ...editedRole.permissions,
        [category]: {
          ...editedRole.permissions[category],
          permissions: editedRole.permissions[category].permissions.map(p => ({
            ...p,
            enabled
          }))
        }
      }
    })
  }
  
  const currentData = isEditing ? editedRole : role
  
  // Count enabled permissions
  const totalPermissions = Object.values(currentData.permissions).reduce(
    (sum, cat) => sum + cat.permissions.length,
    0
  )
  const enabledPermissions = Object.values(currentData.permissions).reduce(
    (sum, cat) => sum + cat.permissions.filter(p => p.enabled).length,
    0
  )
  
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/admin/roles')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Roles</span>
      </button>
      
      {/* Header Card */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedRole.name}
                  onChange={(e) => setEditedRole({ ...editedRole, name: e.target.value })}
                  className="input mb-2 text-2xl font-bold w-full"
                />
              ) : (
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{currentData.name}</h1>
              )}
              
              {isEditing ? (
                <textarea
                  value={editedRole.description}
                  onChange={(e) => setEditedRole({ ...editedRole, description: e.target.value })}
                  className="input w-full min-h-[60px]"
                />
              ) : (
                <p className="text-slate-600 mb-4">{currentData.description}</p>
              )}
              
              <div className="flex items-center gap-3">
                {currentData.is_system && (
                  <span className="badge bg-slate-100 text-slate-600">
                    <Lock className="w-4 h-4 mr-1" />
                    System Role
                  </span>
                )}
                <span className="badge bg-primary-100 text-primary-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {enabledPermissions} of {totalPermissions} permissions
                </span>
                <span className="badge bg-blue-100 text-blue-600">
                  <Users className="w-4 h-4 mr-1" />
                  {currentData.users_count} users
                </span>
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
              <button 
                onClick={handleEdit} 
                className="btn btn-primary"
                disabled={currentData.is_system}
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit Role
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Permissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(currentData.permissions).map(([key, category]) => {
          const allEnabled = category.permissions.every(p => p.enabled)
          const someEnabled = category.permissions.some(p => p.enabled)
          
          return (
            <div key={key} className="card">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">{category.label}</h3>
                {isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAllInCategory(key, true)}
                      className="btn btn-outline btn-sm"
                      disabled={allEnabled}
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => toggleAllInCategory(key, false)}
                      className="btn btn-outline btn-sm"
                      disabled={!someEnabled}
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {category.permissions.map((permission) => (
                  <label
                    key={permission.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      permission.enabled
                        ? 'border-primary-200 bg-primary-50'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <input
                      type="checkbox"
                      checked={permission.enabled}
                      onChange={() => togglePermission(key, permission.id)}
                      disabled={!isEditing}
                      className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                    />
                    <div className="flex-1">
                      <span className={`text-sm font-medium ${
                        permission.enabled ? 'text-slate-900' : 'text-slate-600'
                      }`}>
                        {permission.label}
                      </span>
                    </div>
                    {permission.enabled && (
                      <CheckCircle className="w-5 h-5 text-primary-600" />
                    )}
                  </label>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Enabled</span>
                  <span className="font-semibold text-slate-900">
                    {category.permissions.filter(p => p.enabled).length} of {category.permissions.length}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* System Role Notice */}
      {currentData.is_system && (
        <div className="card bg-warning-50 border-2 border-warning-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <h4 className="font-semibold text-warning-900 mb-1">System Role</h4>
              <p className="text-sm text-warning-700">
                This is a system-defined role and cannot be edited or deleted. System roles are essential for platform operation and security.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
