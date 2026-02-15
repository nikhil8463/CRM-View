import { Phone, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react'

/**
 * AI Call Outcomes Component
 * Shows distribution and results of AI-powered calls
 */
export default function AICallOutcomes() {
  // Mock data - replace with actual API call
  const outcomes = [
    { 
      status: 'Answered', 
      count: 87, 
      percentage: 60, 
      color: 'bg-success-500',
      icon: CheckCircle,
      iconColor: 'text-success-500'
    },
    { 
      status: 'Voicemail', 
      count: 35, 
      percentage: 24, 
      color: 'bg-warning-500',
      icon: Phone,
      iconColor: 'text-warning-500'
    },
    { 
      status: 'No Answer', 
      count: 18, 
      percentage: 12, 
      color: 'bg-slate-400',
      icon: Clock,
      iconColor: 'text-slate-400'
    },
    { 
      status: 'Failed', 
      count: 5, 
      percentage: 4, 
      color: 'bg-danger-500',
      icon: XCircle,
      iconColor: 'text-danger-500'
    },
  ]
  
  const totalCalls = outcomes.reduce((sum, o) => sum + o.count, 0)
  const successRate = Math.round((outcomes[0].count / totalCalls) * 100)
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="section-title">AI Call Outcomes</h3>
          <p className="body-text text-slate-500 mt-1">Today's calling performance</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-success-600">{successRate}%</div>
          <div className="text-xs text-slate-500">Success Rate</div>
        </div>
      </div>
      
      {/* Donut Chart Visualization */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          {/* SVG Donut Chart */}
          <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="12"
            />
            {outcomes.map((outcome, index) => {
              const offset = outcomes.slice(0, index).reduce((sum, o) => sum + o.percentage, 0)
              const circumference = 2 * Math.PI * 40
              const dashArray = `${(outcome.percentage / 100) * circumference} ${circumference}`
              const dashOffset = -(offset / 100) * circumference
              
              return (
                <circle
                  key={outcome.status}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={outcome.color.replace('bg-', '#')}
                  strokeWidth="12"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  className={outcome.color.replace('bg-', 'stroke-')}
                />
              )
            })}
          </svg>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-slate-900">{totalCalls}</div>
            <div className="text-xs text-slate-500">Total Calls</div>
          </div>
        </div>
      </div>
      
      {/* Outcome List */}
      <div className="space-y-3">
        {outcomes.map((outcome) => {
          const Icon = outcome.icon
          return (
            <div key={outcome.status} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${outcome.color} bg-opacity-10 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${outcome.iconColor}`} />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">{outcome.status}</div>
                  <div className="text-xs text-slate-500">{outcome.percentage}% of total</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">{outcome.count}</div>
                <div className="text-xs text-slate-500">calls</div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* AI Insights */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-ai-50 to-primary-50 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ai-600 to-primary-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-900 mb-1">AI Insight</div>
            <p className="text-xs text-slate-600">
              Answer rate increased by 15% since optimizing call timing. 
              Best time: 10 AM - 2 PM on weekdays.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
