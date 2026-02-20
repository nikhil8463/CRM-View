import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isValidating: true, // Add validation state
      
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true, isValidating: false })
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, isValidating: false })
        localStorage.removeItem('auth-storage')
      },
      
      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } })
      },
      
      setValidating: (isValidating) => {
        set({ isValidating })
      },
      
      // Clear auth without validation flag change
      clearAuth: () => {
        set({ user: null, token: null, isAuthenticated: false })
        localStorage.removeItem('auth-storage')
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
