import { useQuery } from '@tanstack/react-query'
import { 
  TrendingUp, 
  Users, 
  Phone, 
  Target, 
  Sparkles,
  CheckSquare,
  UserCheck,
  AlertTriangle,
  Loader2
} from 'lucide-react'
import StatsCard from '@/components/dashboard/StatsCard'
import AIActivityFeed from '@/components/dashboard/AIActivityFeed'
import CampaignPerformance from '@/components/dashboard/CampaignPerformance'
import RecentLeads from '@/components/dashboard/RecentLeads'
import ConversionFunnel from '@/components/dashboard/ConversionFunnel'
import AICallOutcomes from '@/components/dashboard/AICallOutcomes'
import AIInsightsPanel from '@/components/dashboard/AIInsightsPanel'
import RecentActivityTimeline from '@/components/dashboard/RecentActivityTimeline'
import { useAuthStore } from '@/store/authStore'
import { useCampaigns } from '@/hooks/useCampaigns'
import { useLeads } from '@/hooks/useLeads'
import { useCalls } from '@/hooks/useCalls'
import { useTasks, useOverdueTasks } from '@/hooks/useTasks'
import { isAdmin } from '@/utils/permissions'

export default function Dashboard() {
  const { user } = useAuthStore()
  
  // Check admin status using utility function
  const userIsAdmin = isAdmin(user)
  
  // Fetch real data from backend with automatic cache invalidation
  const { data: leadsData, isLoading: leadsLoading } = useLeads({ assigned_to: userIsAdmin ? undefined : user?.id })
  const { data: campaignsData, isLoading: campaignsLoading } = useCampaigns({ status: userIsAdmin ? undefined : 'active' })
  const { data: callsData, isLoading: callsLoading } = useCalls({ 
    date_from: new Date().toISOString().split('T')[0], // Today's calls
    date_to: new Date().toISOString().split('T')[0]
  })
  const { data: tasksData, isLoading: tasksLoading } = useTasks({ 
    assigned_to: userIsAdmin ? undefined : user?.id,
    due_date: new Date().toISOString().split('T')[0] // Today's tasks
  })
  const { data: overdueTasksData, isLoading: overdueLoading } = useOverdueTasks()
  
  // Calculate metrics from real data - handle Laravel response structure
  // Named resources: {leads: [...], total}, {campaigns: [...], total}, {tasks: [...], total}
  // Paginated: {data: [...], total, current_page} for calls
  const leadsArray = leadsData?.leads || []
  const campaignsArray = campaignsData?.campaigns || []
  const callsArray = callsData?.data || [] // Calls uses Laravel pagination
  const tasksArray = tasksData?.tasks || []
  const overdueTasksArray = overdueTasksData?.tasks || []
  
  // Ensure all metrics are valid numbers, never NaN
  const totalLeads = Array.isArray(leadsArray) ? leadsArray.length : 0
  const myLeads = userIsAdmin ? totalLeads : (Array.isArray(leadsArray) ? leadsArray.filter(l => l.assigned_to === user?.id)?.length : 0) || 0
  const activeCampaigns = Array.isArray(campaignsArray) ? campaignsArray.filter(c => c.status === 'active')?.length : 0
  const assignedCampaigns = userIsAdmin ? activeCampaigns : (Array.isArray(campaignsArray) ? campaignsArray.filter(c => c.status === 'active')?.length : 0) || 0
  const callsToday = Array.isArray(callsArray) ? callsArray.length : 0
  const todayTasks = Array.isArray(tasksArray) ? tasksArray.length : 0
  const overdueTasks = Array.isArray(overdueTasksArray) ? overdueTasksArray.length : 0
  
  // Show loading state while fetching initial data
  const isLoadingStats = leadsLoading || campaignsLoading || callsLoading || tasksLoading || overdueLoading
  
  // Admin Stats (Original 4 cards) - now with real data
  const adminStats = [
    {
      title: 'Total Leads',
      value: (totalLeads || 0).toString(),
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'primary'
    },
    {
      title: 'Active Campaigns',
      value: (activeCampaigns || 0).toString(),
      change: '+2',
      trend: 'up',
      icon: Target,
      color: 'success'
    },
    {
      title: 'Calls Today',
      value: (callsToday || 0).toString(),
      change: '+23.8%',
      trend: 'up',
      icon: Phone,
      color: 'warning'
    },
    {
      title: 'AI Actions',
      value: '1,234', // TODO: Implement AI actions tracking
      change: '+45.2%',
      trend: 'up',
      icon: Sparkles,
      color: 'ai'
    },
  ]
  
  // Staff Stats (New 5 cards) - now with real data
  const staffStats = [
    {
      title: 'Assigned Campaigns',
      value: (assignedCampaigns || 0).toString(),
      change: '+1',
      trend: 'up',
      icon: Target,
      color: 'primary'
    },
    {
      title: 'My Leads',
      value: (myLeads || 0).toString(),
      change: '+8',
      trend: 'up',
      icon: Users,
      color: 'success'
    },
    {
      title: 'Today\'s Tasks',
      value: (todayTasks || 0).toString(),
      change: '+3',
      trend: 'up',
      icon: CheckSquare,
      color: 'warning'
    },
    {
      title: 'AI Calls Triggered',
      value: (callsToday || 0).toString(), // Using calls today as AI calls
      change: '+15.2%',
      trend: 'up',
      icon: Phone,
      color: 'ai'
    },
    {
      title: 'Overdue Tasks',
      value: (overdueTasks || 0).toString(),
      change: '-1',
      trend: 'down',
      icon: AlertTriangle,
      color: 'danger'
    },
  ]
  
  const stats = userIsAdmin ? adminStats : staffStats
  
  // Show loading spinner while fetching initial data
  if (isLoadingStats) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-slate-600 mt-2">
          {userIsAdmin 
            ? "Here's an overview of your CRM performance today." 
            : "Here's what's on your plate today."
          }
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${userIsAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-5'} gap-6`}>
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
      
      {/* Admin Dashboard Layout */}
      {userIsAdmin && (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConversionFunnel />
            <AICallOutcomes />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              <CampaignPerformance />
              <RecentLeads />
            </div>
            
            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              <AIInsightsPanel />
            </div>
          </div>
        </>
      )}
      
      {/* Staff Dashboard Layout */}
      {!userIsAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <CampaignPerformance />
            <RecentLeads />
          </div>
          
          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <AIActivityFeed />
            <RecentActivityTimeline />
          </div>
        </div>
      )}
    </div>
  )
}
