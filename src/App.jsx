import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Layouts
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'

// Auth Pages
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

// Dashboard Pages
import Dashboard from '@/pages/Dashboard'
import Campaigns from '@/pages/campaigns/Campaigns'
import CampaignDetail from '@/pages/campaigns/CampaignDetail'
import CampaignCreate from '@/pages/campaigns/CampaignCreate'
import CampaignEdit from '@/pages/campaigns/CampaignEdit'
import Leads from '@/pages/leads/Leads'
import LeadDetail from '@/pages/leads/LeadDetail'
import LeadCreate from '@/pages/leads/LeadCreate'
import LeadEdit from '@/pages/leads/LeadEdit'
import Calls from '@/pages/calls/Calls'
import CallDetail from '@/pages/calls/CallDetail'
import Communications from '@/pages/communications/Communications'
import CommunicationDetail from '@/pages/communications/CommunicationDetail'
import Tasks from '@/pages/tasks/Tasks'
import TaskDetail from '@/pages/tasks/TaskDetail'
import TaskCreate from '@/pages/tasks/TaskCreate'
import TaskEdit from '@/pages/tasks/TaskEdit'
import Integrations from '@/pages/integrations/Integrations'
import IntegrationDetail from '@/pages/integrations/IntegrationDetail'
import AIInsights from '@/pages/ai/AIInsights'
import AIShowcase from '@/pages/ai/AIShowcase'
import Analytics from '@/pages/analytics/Analytics'
import Settings from '@/pages/settings/Settings'
import Users from '@/pages/admin/Users'
import UserDetail from '@/pages/admin/UserDetail'
import Roles from '@/pages/admin/Roles'
import RoleDetail from '@/pages/admin/RoleDetail'
import AuditLogs from '@/pages/admin/AuditLogs'

// Protected Route Components
import ProtectedRoute from '@/components/ProtectedRoute'

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
  )
}

export default App
