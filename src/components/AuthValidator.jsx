import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import authService from '@/services/authService'
import { Loader2 } from 'lucide-react'

/**
 * Component to validate authentication token on app load
 */
export default function AuthValidator({ children }) {
  const { token, isValidating, setValidating, clearAuth, setAuth } = useAuthStore()

  useEffect(() => {
    const validateToken = async () => {
      // If no token, skip validation
      if (!token) {
        setValidating(false)
        return
      }

      try {
        // Validate token by fetching current user
        const response = await authService.me()
        
        if (response.user) {
          // Token is valid, update user data
          setAuth(response.user, token)
        } else {
          // Invalid response, clear auth
          clearAuth()
        }
      } catch (error) {
        // Token is invalid or expired, clear auth
        console.log('Token validation failed:', error.message)
        clearAuth()
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, []) // Run only once on mount

  // Show loading screen while validating
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return children
}
