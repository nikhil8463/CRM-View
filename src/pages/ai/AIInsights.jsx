import { useNavigate } from 'react-router-dom'
import { 
  Sparkles, 
  TrendingUp, 
  Target,
  Brain,
  Zap,
  ChevronRight,
  Palette
} from 'lucide-react'
import AIBadge from '@/components/ai/AIBadge'
import AIInsightCard from '@/components/ai/AIInsightCard'

export default function AIInsights() {
  const navigate = useNavigate()
  
  // Mock AI insights data
  const aiMetrics = [
    {
      title: 'AI Actions Today',
      value: '247',
      change: '+23%',
      icon: Zap,
      color: 'purple'
    },
    {
      title: 'Leads Scored',
      value: '1,284',
      change: '+12%',
      icon: Target,
      color: 'indigo'
    },
    {
      title: 'Calls Triggered',
      value: '156',
      change: '+8%',
      icon: Brain,
      color: 'purple'
    },
    {
      title: 'Conversion Rate',
      value: '34.2%',
      change: '+5.3%',
      icon: TrendingUp,
      color: 'success'
    }
  ]
  
  const topRecommendations = [
    {
      id: 1,
      title: 'Call 12 high-priority leads',
      description: 'AI identified leads with 85%+ score that need immediate follow-up',
      action_type: 'call',
      confidence: 94
    },
    {
      id: 2,
      title: 'Re-engage 23 cold leads',
      description: 'These leads showed previous interest but went cold. AI suggests optimal re-engagement time',
      action_type: 'email',
      confidence: 87
    },
    {
      id: 3,
      title: 'Schedule demos for 8 leads',
      description: 'Leads matching ideal customer profile with high engagement signals',
      action_type: 'schedule',
      confidence: 91
    }
  ]
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">AI Insights</h1>
            <AIBadge type="analyzed" size="sm" />
          </div>
          <p className="body-text text-slate-600 mt-2">
            AI-powered analytics and recommendations to optimize your CRM performance
          </p>
        </div>
        
        <button
          onClick={() => navigate('/dashboard/ai-showcase')}
          className="btn btn-secondary btn-sm"
        >
          <Palette className="w-4 h-4" />
          View AI Components
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Quick Access Card to AI Showcase */}
      <div 
        onClick={() => navigate('/dashboard/ai-showcase')}
        className="card bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 hover:shadow-lg transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                AI Visual Language Showcase
              </h3>
              <p className="text-sm text-slate-600">
                Explore all AI badges, indicators, and insight cards used throughout the CRM
              </p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-purple-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
      
      {/* AI Metrics Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {aiMetrics.map((metric, idx) => {
          const IconComponent = metric.icon
          const colorClasses = {
            purple: 'bg-purple-100 text-purple-600',
            indigo: 'bg-indigo-100 text-indigo-600',
            success: 'bg-success-100 text-success-600'
          }
          
          return (
            <div key={idx} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[metric.color]}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="badge bg-success-100 text-success-700">
                  {metric.change}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-1">{metric.title}</p>
              <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
            </div>
          )
        })}
      </div>
      
      {/* AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIInsightCard
          type="suggestion"
          title="Top AI Recommendations"
          subtitle="Actions that will have the highest impact today"
          insights={topRecommendations}
          onAction={(insight) => console.log('Action clicked:', insight)}
        />
        
        <div className="space-y-6">
          {/* AI Performance */}
          <div className="card">
            <h3 className="section-title mb-4">AI Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Lead Scoring Accuracy</span>
                  <span className="text-sm font-semibold text-slate-900">94%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Call Success Rate</span>
                  <span className="text-sm font-semibold text-slate-900">87%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full" style={{ width: '87%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Recommendation Adoption</span>
                  <span className="text-sm font-semibold text-slate-900">78%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="card">
            <h3 className="section-title mb-4">AI Features</h3>
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/dashboard/leads')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-slate-900">AI Lead Scoring</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              
              <button 
                onClick={() => navigate('/dashboard/calls')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-slate-900">AI Call Analysis</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              
              <button 
                onClick={() => navigate('/dashboard/ai-showcase')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-slate-900">AI Visual Components</span>
                </div>
                <ChevronRight className="w-4 h-4 text-purple-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
