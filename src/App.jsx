import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Loader2 } from 'lucide-react'

// Components
import AuthValidator from '@/components/AuthValidator'

// Layouts
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'

// Auth Pages (eager loaded - needed immediately)
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

// Protected Route Components
import ProtectedRoute from '@/components/ProtectedRoute'

// Lazy load all dashboard pages for better performance
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Campaigns = lazy(() => import('@/pages/campaigns/Campaigns'))
const CampaignDetail = lazy(() => import('@/pages/campaigns/CampaignDetail'))
const CampaignCreate = lazy(() => import('@/pages/campaigns/CampaignCreate'))
const CampaignEdit = lazy(() => import('@/pages/campaigns/CampaignEdit'))
const Leads = lazy(() => import('@/pages/leads/Leads'))
const LeadDetail = lazy(() => import('@/pages/leads/LeadDetail'))
const LeadCreate = lazy(() => import('@/pages/leads/LeadCreate'))
const LeadEdit = lazy(() => import('@/pages/leads/LeadEdit'))
const Calls = lazy(() => import('@/pages/calls/Calls'))
const CallDetail = lazy(() => import('@/pages/calls/CallDetail'))
const Communications = lazy(() => import('@/pages/communications/Communications'))
const CommunicationDetail = lazy(() => import('@/pages/communications/CommunicationDetail'))
const Tasks = lazy(() => import('@/pages/tasks/Tasks'))
const TaskDetail = lazy(() => import('@/pages/tasks/TaskDetail'))
const TaskCreate = lazy(() => import('@/pages/tasks/TaskCreate'))
const TaskEdit = lazy(() => import('@/pages/tasks/TaskEdit'))
const Integrations = lazy(() => import('@/pages/integrations/Integrations'))
const IntegrationDetail = lazy(() => import('@/pages/integrations/IntegrationDetail'))
const AIInsights = lazy(() => import('@/pages/ai/AIInsights'))
const AIShowcase = lazy(() => import('@/pages/ai/AIShowcase'))
const Analytics = lazy(() => import('@/pages/analytics/Analytics'))
const Settings = lazy(() => import('@/pages/settings/Settings'))
const Users = lazy(() => import('@/pages/admin/Users'))
const UserDetail = lazy(() => import('@/pages/admin/UserDetail'))
const Roles = lazy(() => import('@/pages/admin/Roles'))
const RoleDetail = lazy(() => import('@/pages/admin/RoleDetail'))
const AuditLogs = lazy(() => import('@/pages/admin/AuditLogs'))

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
  </div>
)

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

function App() {
  const { isAuthenticated } = useAuthStore()
  
  return (
    <AuthValidator>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="register" element={
            <ProtectedRoute requireAdmin={true} redirectTo="/login">
              <Register />
            </ProtectedRoute>
          } />
        </Route>

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          
          {/* Campaign Routes */}
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="campaigns/create" element={<CampaignCreate />} />
          <Route path="campaigns/:id" element={<CampaignDetail />} />
          <Route path="campaigns/:id/edit" element={<CampaignEdit />} />
          
          {/* Lead Routes */}
          <Route path="leads" element={<Leads />} />
          <Route path="leads/create" element={<LeadCreate />} />
          <Route path="leads/:id" element={<LeadDetail />} />
          <Route path="leads/:id/edit" element={<LeadEdit />} />
          
          {/* Call Routes */}
          <Route path="calls" element={<Calls />} />
          <Route path="calls/:id" element={<CallDetail />} />
          
          {/* Communication Routes */}
          <Route path="communications" element={<Communications />} />
          <Route path="communications/:id" element={<CommunicationDetail />} />
          
          {/* Task Routes */}
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/create" element={<TaskCreate />} />
          <Route path="tasks/:id" element={<TaskDetail />} />
          <Route path="tasks/:id/edit" element={<TaskEdit />} />
          
          {/* Integration Routes */}
          <Route path="integrations" element={<Integrations />} />
          <Route path="integrations/:service" element={<IntegrationDetail />} />
          
          {/* AI Routes */}
          <Route path="ai-insights" element={<AIInsights />} />
          <Route path="ai-showcase" element={<AIShowcase />} />
          
          {/* Analytics Routes */}
          <Route path="analytics" element={<Analytics />} />
          
          {/* Admin Routes - Admin Only */}
          <Route path="admin/users" element={
            <ProtectedRoute requireAdmin={true}>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="admin/users/:id" element={
            <ProtectedRoute requireAdmin={true}>
              <UserDetail />
            </ProtectedRoute>
          } />
          <Route path="admin/roles" element={
            <ProtectedRoute requireAdmin={true}>
              <Roles />
            </ProtectedRoute>
          } />
          <Route path="admin/roles/:id" element={
            <ProtectedRoute requireAdmin={true}>
              <RoleDetail />
            </ProtectedRoute>
          } />
          <Route path="admin/audit-logs" element={
            <ProtectedRoute requireAdmin={true}>
              <AuditLogs />
            </ProtectedRoute>
          } />
          
          {/* Settings Routes */}
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
    </AuthValidator>
  )
}

export default App
