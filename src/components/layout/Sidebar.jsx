import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Megaphone, 
  Users, 
  MessageSquare, 
  CheckSquare, 
  Sparkles, 
  Settings, 
  X,
  UserCog,
  Zap,
  Plug,
  Shield,
  ShieldCheck,
  Brain,
  BarChart3
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { isAdmin } from '@/utils/permissions'

// Main navigation for all users
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone },
  { name: 'Leads', href: '/dashboard/leads', icon: Users },
  { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
  { name: 'Communication Logs', href: '/dashboard/communications', icon: MessageSquare },
  { name: 'Integrations', href: '/dashboard/integrations', icon: Plug },
  { name: 'AI Insights', href: '/dashboard/ai-insights', icon: Brain },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
]

// Admin-only navigation
const adminNavigation = [
  { name: 'Users', href: '/dashboard/admin/users', icon: UserCog },
  { name: 'Roles', href: '/dashboard/admin/roles', icon: Shield },
  { name: 'Audit Logs', href: '/dashboard/admin/audit-logs', icon: ShieldCheck },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const { user } = useAuthStore()
  
  // Check admin status using utility function
  const userIsAdmin = isAdmin(user)
  
  const isActive = (href) => {
    if (href === '/dashboard') {
      return location.pathname === href
    }
    return location.pathname.startsWith(href)
  }
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-slate-900
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-ai-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI CRM</h1>
                <p className="text-xs text-slate-400">Enterprise</p>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-300 transition-colors duration-200 ease-in-out"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
            {/* Main Navigation */}
            <div className="space-y-1 mb-6">
              {navigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center px-3 py-2.5 text-sm font-medium rounded-xl
                      transition-all duration-200 ease-in-out
                      ${active 
                        ? 'bg-primary-600 text-white' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
            
            {/* Admin Navigation (only for admins) */}
            {userIsAdmin && (
              <div>
                <div className="px-3 mb-2">
                  <div className="h-px bg-slate-800"></div>
                </div>
                <div className="flex items-center justify-between px-3 py-2 mb-2">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Administration
                  </h3>
                </div>
                <div className="space-y-1">
                  {adminNavigation.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={onClose}
                        className={`
                          flex items-center px-3 py-2.5 text-sm font-medium rounded-xl
                          transition-all duration-200 ease-in-out
                          ${active 
                            ? 'bg-primary-600 text-white' 
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </nav>
          
          {/* User Info - Sticky Footer */}
          <div className="sticky bottom-0 p-4 border-t border-slate-800 bg-slate-900">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-ai-500 flex items-center justify-center ring-2 ring-slate-800">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.role?.name || 'Staff'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
