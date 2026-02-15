/**
 * Permission Utilities
 * Helper functions for checking user permissions and roles
 */

/**
 * Check if user is admin
 * @param {Object} user - User object from authStore
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  if (!user) return false
  
  return user?.role_id === 1 || 
         user?.role?.name === 'super_admin' || 
         user?.role?.name === 'Super Admin' ||
         user?.role?.name === 'Admin'
}

/**
 * Check if user has specific permission
 * @param {Object} user - User object from authStore
 * @param {string|string[]} permission - Permission name or array of permissions
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
  if (!user) return false
  
  // Admins have all permissions
  if (isAdmin(user)) return true
  
  const permissions = Array.isArray(permission) ? permission : [permission]
  const userPermissions = user?.permissions || user?.role?.permissions || []
  
  return permissions.some(perm => 
    userPermissions.some(p => 
      p === perm || 
      p.name === perm || 
      p.slug === perm
    )
  )
}

/**
 * Check if user has all specified permissions
 * @param {Object} user - User object from authStore
 * @param {string[]} permissions - Array of permission names
 * @returns {boolean}
 */
export const hasAllPermissions = (user, permissions) => {
  if (!user) return false
  
  // Admins have all permissions
  if (isAdmin(user)) return true
  
  const userPermissions = user?.permissions || user?.role?.permissions || []
  
  return permissions.every(perm => 
    userPermissions.some(p => 
      p === perm || 
      p.name === perm || 
      p.slug === perm
    )
  )
}

/**
 * Check if user can access a specific module
 * @param {Object} user - User object from authStore
 * @param {string} module - Module name (e.g., 'users', 'roles', 'audit-logs')
 * @returns {boolean}
 */
export const canAccessModule = (user, module) => {
  const adminModules = ['users', 'roles', 'audit-logs', 'settings']
  
  if (adminModules.includes(module)) {
    return isAdmin(user)
  }
  
  // Other modules are accessible to all authenticated users
  return true
}

/**
 * Check if user can perform action on resource
 * @param {Object} user - User object from authStore
 * @param {string} action - Action name (create, read, update, delete)
 * @param {string} resource - Resource name (campaign, lead, task, etc)
 * @returns {boolean}
 */
export const canPerformAction = (user, action, resource) => {
  if (!user) return false
  
  // Admins can do everything
  if (isAdmin(user)) return true
  
  // Check specific permission
  const permissionName = `${resource}.${action}`
  return hasPermission(user, permissionName)
}

/**
 * Get user's role display name
 * @param {Object} user - User object from authStore
 * @returns {string}
 */
export const getUserRole = (user) => {
  if (!user) return 'Guest'
  return user?.role?.name || user?.role || 'Staff'
}

/**
 * Check if user owns the resource
 * @param {Object} user - User object from authStore
 * @param {Object} resource - Resource object with owner/user info
 * @returns {boolean}
 */
export const isOwner = (user, resource) => {
  if (!user || !resource) return false
  
  return resource.user_id === user.id || 
         resource.created_by === user.id ||
         resource.assigned_to === user.id ||
         resource.owner_id === user.id
}
