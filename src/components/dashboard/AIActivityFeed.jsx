import { Sparkles, Brain, Zap, CheckCircle, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function AIActivityFeed() {
  // Mock AI activities - replace with actual API data
  const activities = [
    {
      id: 1,
      type: 'lead_scored',
      message: 'Scored new lead: John Smith',
      score: 85,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      icon: Brain,
      color: 'ai'
    },
    {
      id: 2,
      type: 'automation_triggered',
      message: 'Auto-assigned lead to Sarah Johnson',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      icon: Zap,
      color: 'warning'
    },
    {
      id: 3,
      type: 'call_completed',
      message: 'AI call completed with 92% sentiment',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      icon: CheckCircle,
      color: 'success'
    },
    {
      id: 4,
      type: 'recommendation',
      message: 'Recommended follow-up for 3 leads',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      icon: Sparkles,
      color: 'primary'
    },
    {
      id: 5,
      type: 'alert',
      message: 'High-value lead requires attention',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      icon: AlertCircle,
      color: 'danger'
    },
  ]
  
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600',
    danger: 'bg-danger-100 text-danger-600',
    ai: 'bg-ai-100 text-ai-600',
  }
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-ai-600" />
          AI Activity
        </h2>
        <span className="badge badge-ai">Live</span>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${colorClasses[activity.color]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                {activity.score && (
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2 max-w-[100px]">
                      <div
                        className="bg-ai-600 h-1.5 rounded-full"
                        style={{ width: `${activity.score}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{activity.score}%</span>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      
      <button className="btn btn-secondary w-full mt-4">
        View All Activity
      </button>
    </div>
  )
}
