import { Sparkles, TrendingUp, AlertCircle, Target, Brain } from 'lucide-react'

/**
 * AI Insights Panel Component
 * Shows AI-powered recommendations and alerts for admins
 */
export default function AIInsightsPanel() {
  // Mock data - replace with actual API call
  const insights = {
    followUps: [
      {
        lead: 'John Smith - Acme Corp',
        reason: 'High engagement score (87), last contact 3 days ago',
        priority: 'high',
        action: 'Schedule demo call'
      },
      {
        lead: 'Sarah Johnson - Tech Inc',
        reason: 'Viewed pricing page 5 times this week',
        priority: 'high',
        action: 'Send pricing proposal'
      },
      {
        lead: 'Mike Davis - Global Ltd',
        reason: 'Email opened but no response for 7 days',
        priority: 'medium',
        action: 'Send follow-up email'
      },
    ],
    alerts: [
      {
        type: 'warning',
        campaign: 'Q1 Enterprise Campaign',
        message: 'Conversion rate dropped 12% this week',
        action: 'Review targeting'
      },
      {
        type: 'success',
        campaign: 'SMB Outreach Campaign',
        message: 'Response rate up 28% after AI optimization',
        action: 'Scale up budget'
      },
    ],
    leadScoring: [
      { range: '80-100', label: 'Hot', count: 143, color: 'bg-danger-500', percentage: 23 },
      { range: '60-79', label: 'Warm', count: 287, color: 'bg-warning-500', percentage: 46 },
      { range: '40-59', label: 'Cool', count: 156, color: 'bg-primary-500', percentage: 25 },
      { range: '0-39', label: 'Cold', count: 37, color: 'bg-slate-400', percentage: 6 },
    ]
  }
  
  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ai-600 to-primary-600 flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="section-title">AI Insights</h3>
          <p className="text-xs text-slate-500">Powered by LangChain</p>
        </div>
      </div>
      
      {/* Recommended Follow-ups */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-primary-600" />
          <h4 className="text-sm font-semibold text-slate-900">Recommended Follow-ups</h4>
        </div>
        <div className="space-y-3">
          {insights.followUps.map((followUp, index) => (
            <div key={index} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="text-sm font-medium text-slate-900 flex-1">{followUp.lead}</div>
                <span className={`
                  text-xs px-2 py-1 rounded-lg font-medium
                  ${followUp.priority === 'high' ? 'bg-danger-100 text-danger-700' : 'bg-warning-100 text-warning-700'}
                `}>
                  {followUp.priority === 'high' ? 'High' : 'Medium'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-2">{followUp.reason}</p>
              <button className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {followUp.action}
              </button>
            </div>
          ))}
        </div>
        <button className="mt-3 w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
          View all recommendations →
        </button>
      </div>
      
      {/* Campaign Performance Alerts */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-4 h-4 text-warning-600" />
          <h4 className="text-sm font-semibold text-slate-900">Campaign Alerts</h4>
        </div>
        <div className="space-y-3">
          {insights.alerts.map((alert, index) => (
            <div 
              key={index} 
              className={`
                p-3 rounded-xl border-l-4
                ${alert.type === 'warning' 
                  ? 'bg-warning-50 border-warning-500' 
                  : 'bg-success-50 border-success-500'
                }
              `}
            >
              <div className="text-sm font-medium text-slate-900 mb-1">{alert.campaign}</div>
              <p className="text-xs text-slate-600 mb-2">{alert.message}</p>
              <button className={`
                text-xs font-medium flex items-center gap-1
                ${alert.type === 'warning' ? 'text-warning-700' : 'text-success-700'}
              `}>
                {alert.action} →
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Lead Scoring Distribution */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-success-600" />
          <h4 className="text-sm font-semibold text-slate-900">Lead Score Distribution</h4>
        </div>
        
        {/* Horizontal Bar Chart */}
        <div className="mb-4">
          <div className="flex h-8 rounded-xl overflow-hidden">
            {insights.leadScoring.map((score) => (
              <div
                key={score.range}
                className={`${score.color} flex items-center justify-center text-xs font-medium text-white`}
                style={{ width: `${score.percentage}%` }}
                title={`${score.label}: ${score.count} leads`}
              >
                {score.percentage > 15 && score.count}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2">
          {insights.leadScoring.map((score) => (
            <div key={score.range} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${score.color}`} />
              <div className="flex-1">
                <div className="text-xs font-medium text-slate-900">{score.label}</div>
                <div className="text-xs text-slate-500">{score.count} leads</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* AI Status Footer */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-success-600">
            <div className="w-2 h-2 rounded-full bg-success-600 animate-pulse" />
            <span>AI Analysis Active</span>
          </div>
          <span className="text-slate-500">Updated 2 min ago</span>
        </div>
      </div>
    </div>
  )
}
