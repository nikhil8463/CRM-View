import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { isAdmin as checkIsAdmin, hasAllPermissions } from '@/utils/permissions'

/**
 * ProtectedRoute Component
 * Restricts access to routes based on user role/permissions
 * 
 * @param {ReactNode} children - Child components to render if authorized
 * @param {boolean} requireAdmin - If true, only admins can access this route
 * @param {string[]} requiredPermissions - Array of permission names required
 * @param {string} redirectTo - Where to redirect unauthorized users (default: /dashboard)
 */
export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requiredPermissions = [],
  redirectTo = '/dashboard'
}) {
  const { user, isAuthenticated } = useAuthStore()

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  // Check if user is admin using utility function
  const userIsAdmin = checkIsAdmin(user)

  // Require admin access
  if (requireAdmin && !userIsAdmin) {
    return <Navigate to={redirectTo} replace />
  }

  // Check specific permissions if provided
  if (requiredPermissions.length > 0) {
    const hasPermission = hasAllPermissions(user, requiredPermissions)

    if (!hasPermission) {
      return <Navigate to={redirectTo} replace />
    }
  }

  return children
}
