import { Menu, Bell, Search, LogOut, User, Settings, RefreshCw, Moon, Sun } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import toast from 'react-hot-toast'

export default function Header({ onMenuClick }) {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuthStore()
  const { isDarkMode, toggleDarkMode } = useThemeStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const userMenuRef = useRef(null)
  const notificationRef = useRef(null)
  
  // Check if user is ORIGINALLY an admin (check for stored original role)
  const isOriginallyAdmin = user?._originalRoleId === 1 || 
                            user?.role_id === 1 || 
                            user?.role?.name === 'super_admin' || 
                            user?.role?.name === 'Admin'
  
  // Check if currently viewing as staff
  const isViewingAsStaff = user?._originalRoleId !== undefined
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }
  
  const toggleViewAsStaff = () => {
    if (!isViewingAsStaff) {
      // Switch to staff view
      updateUser({ 
        ...user,
        _originalRoleId: user.role_id, // Store original role
        _originalRole: user.role,
        role_id: 2, // Staff role ID
        role: { ...user.role, name: 'Staff', display_name: 'Staff (View Mode)' }
      })
      toast.success('Switched to Staff view')
    } else {
      // Switch back to admin
      updateUser({ 
        ...user,
        role_id: user._originalRoleId || 1,
        role: user._originalRole || { name: 'super_admin', display_name: 'Super Admin' },
        _originalRoleId: undefined,
        _originalRole: undefined
      })
      toast.success('Switched back to Admin view')
    }
    setShowUserMenu(false)
    // Force refresh
    setTimeout(() => window.location.reload(), 100)
  }
  
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 transition-colors">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Left Side */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="Search leads, campaigns, calls..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-colors"
              />
            </div>
          </div>
        </div>
        
        {/* Right Side */}
        <div className="flex items-center space-x-2">
          {/* Mobile Search */}
          <button className="md:hidden p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-2 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 mt-2 bg-primary-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-slate-100">New lead assigned to you</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 mt-2 bg-ai-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-slate-100">AI completed lead analysis</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">15 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 mt-2 bg-success-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-slate-100">Campaign "Q1 Outreach" activated</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-gray-200 dark:border-slate-700">
                  <Link to="/notifications" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-ai-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 capitalize">
                  {user?.role?.display_name || user?.role?.name || 'User'}
                </p>
              </div>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 animate-fade-in">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {user?.role?.display_name || user?.role?.name || 'User'}
                  </p>
                </div>
                
                <Link
                  to="/dashboard/profile"
                  className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </Link>
                <Link
                  to="/dashboard/settings"
                  className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </Link>
                
                {/* Role Switcher - Show for admins OR if viewing as staff */}
                {isOriginallyAdmin && (
                  <>
                    <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                    <button
                      onClick={toggleViewAsStaff}
                      className="flex items-center w-full px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 mr-3" />
                      {isViewingAsStaff ? 'Switch to Admin View' : 'View as Staff'}
                    </button>
                  </>
                )}
                
                <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
