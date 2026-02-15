import { Clock, CheckCircle, AlertCircle, Circle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

/**
 * Recent Activity Timeline Component
 * Shows chronological list of recent activities for staff dashboard
 */
export default function RecentActivityTimeline() {
  // Mock data - replace with actual API call
  const activities = [
    {
      id: 1,
      type: 'call',
      icon: CheckCircle,
      iconColor: 'text-success-600',
      bgColor: 'bg-success-100',
      title: 'Call completed with John Smith',
      description: 'Duration: 8 min - Outcome: Interested',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
    },
    {
      id: 2,
      type: 'task',
      icon: CheckCircle,
      iconColor: 'text-primary-600',
      bgColor: 'bg-primary-100',
      title: 'Task completed: Follow-up email sent',
      description: 'Campaign: Q1 Enterprise Outreach',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
    },
    {
      id: 3,
      type: 'lead',
      icon: Circle,
      iconColor: 'text-warning-600',
      bgColor: 'bg-warning-100',
      title: 'New lead assigned: Sarah Johnson',
      description: 'Company: Tech Inc - Score: 82',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: 4,
      type: 'alert',
      icon: AlertCircle,
      iconColor: 'text-danger-600',
      bgColor: 'bg-danger-100',
      title: 'Task overdue: Demo preparation',
      description: 'Due date was yesterday at 5:00 PM',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
    {
      id: 5,
      type: 'call',
      icon: CheckCircle,
      iconColor: 'text-success-600',
      bgColor: 'bg-success-100',
      title: 'AI Call triggered for Mike Davis',
      description: 'Status: Completed - Voicemail left',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      id: 6,
      type: 'task',
      icon: CheckCircle,
      iconColor: 'text-primary-600',
      bgColor: 'bg-primary-100',
      title: 'Lead status updated to "Qualified"',
      description: 'Lead: Acme Corp - Robert Wilson',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
  ]
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="section-title">Recent Activity</h3>
          <p className="body-text text-slate-500 mt-1">Your latest actions and updates</p>
        </div>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View All
        </button>
      </div>
      
      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />
        
        {/* Activities */}
        <div className="space-y-6">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="relative pl-12">
                {/* Timeline dot */}
                <div className={`
                  absolute left-0 w-10 h-10 rounded-xl ${activity.bgColor}
                  flex items-center justify-center z-10
                `}>
                  <Icon className={`w-5 h-5 ${activity.iconColor}`} />
                </div>
                
                {/* Content */}
                <div className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-medium text-slate-900">{activity.title}</h4>
                    <span className="text-xs text-slate-500 flex-shrink-0">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{activity.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Load More */}
      <div className="mt-6 text-center">
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          Load More Activities
        </button>
      </div>
    </div>
  )
}
